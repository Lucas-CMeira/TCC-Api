import { prisma } from "../pluggins/prisma"
import { EntryType } from "@prisma/client"

export class EntriesRepository {

    async create(data: { 
        title: string, 
        description?: string, 
        value: number, 
        type: EntryType, 
        date: Date, 
        userId: string, 
        categoryId: string, 
        goalId?: string,
        isFixed?: boolean,
        fixedDay?: number,
        parentId?: string
    }) {
        return await prisma.entry.create({
            data
        })
    }

    async findFixedEntries(userId: string) {
        return await prisma.entry.findMany({
            where: { userId, isFixed: true }
        })
    }

    async checkOccurrenceExists(parentId: string, year: number, month: number) {
        // Mês começa no 0 em JS Date, mas no banco vamos usar intervalo
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59);

        const existing = await prisma.entry.findFirst({
            where: {
                parentId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        return existing !== null;
    }

    async findAllByUserId(userId: string) {
        return await prisma.entry.findMany({
            where: { userId },
            include: {
                category: true,
                goal: true
            },
            orderBy: { date: "desc" }
        })
    }

    async findById(id: string, userId: string) {
        return await prisma.entry.findFirst({
            where: { id, userId }
        })
    }

    async update(id: string, userId: string, data: any) {
        return await prisma.entry.update({
            where: { id },
            data,
            include: {
                category: true,
                goal: true
            }
        })
    }

    async delete(id: string, userId: string) {
        return await prisma.entry.delete({
            where: { id }
        })
    }
}
