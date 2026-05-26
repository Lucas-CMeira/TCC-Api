import { FastifyRequest, FastifyReply } from "fastify"
import { AuthService } from "./auth.service"

export class AuthController {

    constructor(private authService: AuthService) {}

    // Cadastro
    async register(request: FastifyRequest, reply: FastifyReply) {

        try {

            const { name, email, password } = request.body as {
                name: string
                email: string
                password: string
            }

            const result = await this.authService.register(
                name,
                email,
                password
            )

            return reply.status(201).send(result)

        } catch (error: any) {

            return reply.status(400).send({
                message: error.message
            })

        }
    }

    // Login
    async login(request: FastifyRequest, reply: FastifyReply) {

        try {

            const { email, password } = request.body as {
                email: string
                password: string
            }

            const result = await this.authService.login(
                email,
                password
            )

            return reply.status(200).send(result)

        } catch (error: any) {

            return reply.status(401).send({
                message: error.message
            })

        }
    }
}