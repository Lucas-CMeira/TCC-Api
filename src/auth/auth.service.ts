import bcrypt from 'bcrypt'
import { AuthRepository } from './auth.repository'
import type { FastifyInstance } from 'fastify';


export class AuthService {

    constructor(private authRepository: AuthRepository,
        private app: FastifyInstance
    ) { }

    async register(name: string, email: string, password: string) {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new Error("Email inválido");
        }

        const userAlreadyExists =
            await this.authRepository.findByEmail(email);

        if (userAlreadyExists) {
            throw new Error("Email já está em uso!");
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await this.authRepository.create({
                name,
                email,
                password: hashedPassword
            });

        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }   
    async login(email: string, password: string) {

        const user = await this.authRepository.findByEmail(email);

        if (!user) {
            throw new Error("Credenciais Inválidas!")
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            throw new Error("Credenciais Inválidas!")
        }

        const token = this.app.jwt.sign({
            sub: user.id,
            name: user.name,
            email: user.email
        });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }

}