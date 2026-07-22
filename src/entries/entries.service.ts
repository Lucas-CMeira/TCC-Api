import { EntriesRepository } from "./entries.repository"
import { EntryType } from "@prisma/client"

export class EntriesService {

    constructor(private entriesRepository: EntriesRepository) { }

    async createEntry(
        title: string, 
        description: string | undefined, 
        value: number, 
        type: string, 
        date: Date, 
        userId: string, 
        categoryId: string, 
        goalId: string | undefined,
        isFixed: boolean = false,
        fixedDay: number | undefined = undefined,
        parentId: string | undefined = undefined
    ) {
        if (!title || value === undefined || !type || !date || !categoryId) {
            throw new Error("Título, Valor, Tipo, Data e Categoria são obrigatórios")
        }

        if (type !== "income" && type !== "expenses") {
            throw new Error("Tipo inválido. Deve ser 'income' ou 'expenses'")
        }

        const payload: any = {
            title,
            value,
            type: type as EntryType,
            date,
            userId,
            categoryId
        };
        if (description) payload.description = description;
        if (goalId) payload.goalId = goalId;
        if (isFixed) payload.isFixed = true;
        if (fixedDay) payload.fixedDay = fixedDay;
        if (parentId) payload.parentId = parentId;

        return await this.entriesRepository.create(payload);
    }

    async getEntries(userId: string) {
        // 1. Sincronizar as entradas fixas para o mês atual
        const fixedEntries = await this.entriesRepository.findFixedEntries(userId);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0 a 11

        for (const fixed of fixedEntries) {
            // Verifica se a entrada original foi criada em um mês futuro
            const fixedEntryDate = new Date(fixed.date);
            if (fixedEntryDate.getFullYear() > currentYear || (fixedEntryDate.getFullYear() === currentYear && fixedEntryDate.getMonth() > currentMonth)) {
                continue; // Não gerar se a data de início for futura
            }

            // O dia da repetição é o fixedDay, ou o dia da data original
            const dayToUse = fixed.fixedDay || fixedEntryDate.getDate();
            
            // Verifica se já existe uma ocorrência desse lançamento no mês atual
            const exists = await this.entriesRepository.checkOccurrenceExists(fixed.id, currentYear, currentMonth);

            if (!exists) {
                // Descobre a nova data para essa repetição (trata dias como 31 em meses que só tem 30)
                // Usa UTC para evitar bug de fuso horário (GMT-3 subtrairia 3h e voltaria 1 dia)
                let newDate = new Date(Date.UTC(currentYear, currentMonth, dayToUse));
                // Se o dia transbordou para o mês seguinte (ex: dia 31 em fevereiro), usa o último dia do mês
                if (newDate.getUTCMonth() !== currentMonth) {
                    newDate = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
                }

                // Cria o lançamento duplicado
                await this.createEntry(
                    fixed.title,
                    fixed.description || undefined,
                    fixed.value,
                    fixed.type,
                    newDate,
                    userId,
                    fixed.categoryId!,
                    fixed.goalId || undefined,
                    false, // a ocorrência não é fixa, apenas o template
                    undefined,
                    fixed.id // aponta para o original
                );
            }
        }

        // 2. Retornar todos os lançamentos
        return await this.entriesRepository.findAllByUserId(userId)
    }

    async updateEntry(
        id: string,
        userId: string,
        data: {
            title?: string
            description?: string
            value?: number
            type?: string
            date?: string
            categoryId?: string
            goalId?: string | null
            isFixed?: boolean
            fixedDay?: number | null
        }
    ) {
        const entry = await this.entriesRepository.findById(id, userId);
        if (!entry) {
            throw new Error("Lançamento não encontrado ou sem permissão");
        }

        const updatePayload: any = {};
        if (data.title !== undefined) updatePayload.title = data.title;
        if (data.description !== undefined) updatePayload.description = data.description;
        if (data.value !== undefined) updatePayload.value = data.value;
        if (data.type !== undefined) {
            if (data.type !== "income" && data.type !== "expenses") {
                throw new Error("Tipo inválido. Deve ser 'income' ou 'expenses'");
            }
            updatePayload.type = data.type as EntryType;
        }
        if (data.date !== undefined) updatePayload.date = new Date(data.date);
        if (data.categoryId !== undefined) updatePayload.categoryId = data.categoryId;
        if (data.goalId !== undefined) updatePayload.goalId = data.goalId;
        if (data.isFixed !== undefined) updatePayload.isFixed = data.isFixed;
        if (data.fixedDay !== undefined) updatePayload.fixedDay = data.fixedDay;

        return await this.entriesRepository.update(id, userId, updatePayload);
    }

    async deleteEntry(id: string, userId: string) {
        const entry = await this.entriesRepository.findById(id, userId);
        if (!entry) {
            throw new Error("Lançamento não encontrado ou sem permissão");
        }
        return await this.entriesRepository.delete(id, userId);
    }
}
