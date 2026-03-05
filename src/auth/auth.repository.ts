import { PrismaClient } from "@prisma/client/extension"

const prisma = new PrismaClient()

export class AuthRepository {

    // Busca o email no banco
    async findByEmail(email:string) {
        return await prisma.user.findUnique({
            where: {email}
        })
    }

    //Cria o usuario no banco
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