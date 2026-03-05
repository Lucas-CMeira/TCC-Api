import { PrismaClient } from "@prisma/client/extension"

const prisma = new PrismaClient()

export class AuthRepository {

    async findByEmail(email:string) {
        return await prisma.user.findUnique({
            where: {email}
        })
    }

    async create(data:{
        name: string
        email: string
        password: string
    }) {
        return await prisma.user.create({
            data
        })
    }

}