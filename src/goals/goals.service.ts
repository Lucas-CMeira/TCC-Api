import { GoalsRepository } from "./goals.repository"
import { prisma } from "../pluggins/prisma"

export class GoalsService {

    constructor(private goalsRepository: GoalsRepository) { }

    async createGoal(title: string, description: string | undefined, value: number, limitDate: Date, userId: string) {
        if (!title || !value || !limitDate) {
            throw new Error("Título, Valor e Data Limite são obrigatórios")
        }

        const payload: any = { title, value, limitDate, userId };
        if (description) payload.description = description;

        return await this.goalsRepository.create(payload);
    }

    async getGoals(userId: string) {
        return await this.goalsRepository.findAllByUserId(userId)
    }

    async updateGoal(
        id: string,
        userId: string,
        data: { title?: string, description?: string, value?: number, limitDate?: string }
    ) {
        const goal = await this.goalsRepository.findById(id, userId);
        if (!goal) {
            throw new Error("Meta não encontrada ou sem permissão");
        }

        const updatePayload: any = {};
        if (data.title) updatePayload.title = data.title;
        if (data.description !== undefined) updatePayload.description = data.description;
        if (data.value) updatePayload.value = data.value;
        if (data.limitDate) updatePayload.limitDate = new Date(data.limitDate);

        return await this.goalsRepository.update(id, userId, updatePayload);
    }

    async deleteGoal(id: string, userId: string) {
        const goal = await this.goalsRepository.findById(id, userId);
        if (!goal) {
            throw new Error("Meta não encontrada ou sem permissão");
        }

        // Calcula o saldo total acumulado atrelado a esta meta
        // Entry.value é Int (centavos * 100) no Prisma, então totalSaved precisa ser Int
        const entries = (goal as any).entries || [];
        const totalSaved = entries.reduce((acc: number, entry: any) => acc + Math.abs(Number(entry.value)), 0);
        const totalSavedInt = Math.round(totalSaved); // Garante Int para o Prisma

        // Se houver saldo guardado na meta, cria um lançamento de receita para devolver o dinheiro ao saldo do usuário
        if (totalSaved > 0) {
            let category = await prisma.category.findFirst({
                where: { userId, name: "Outros" }
            });

            if (!category) {
                category = await prisma.category.findFirst({
                    where: { userId }
                });
            }

            if (!category) {
                category = await prisma.category.create({
                    data: { name: "Outros", color: "6B7280", userId }
                });
            }

            await prisma.entry.create({
                data: {
                    title: `Devolução da Meta: ${goal.title}`,
                    description: `Devolução automática do saldo acumulado da meta excluída "${goal.title}"`,
                    value: totalSavedInt,
                    type: "income",
                    date: new Date(),
                    userId,
                    categoryId: category.id
                }
            });
        }

        // Desvincula os lançamentos da meta antes de excluí-la
        await prisma.entry.updateMany({
            where: { goalId: id },
            data: { goalId: null }
        });

        return await this.goalsRepository.delete(id, userId);
    }
}
