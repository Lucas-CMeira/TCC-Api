import { PrismaClient } from "@prisma/client/extension"

const Prisma = new PrismaClient()

export class AuthRepository {

    async findByEmail(email:string) {
        return await Prisma.user.findUnique({
            where: email
        })
    }

    async create(data:{
        name: string
        email: string
        password: string
    }) {
        return await Prisma.user.create({
            data
        })
    }

}