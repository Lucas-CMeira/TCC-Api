/*
 - Aplica a logica necessaria vinda do controller
 - 
*/

import bcrypt from 'bcrypt'
import { AuthRepository } from './auth.repository';
export class AuthService {

    constructor(private authRepository: AuthRepository){
        
    }

    async register(name: string, email: string, password: string){

        // Verifição de email (existente ou não)
        const userAlreadyExists = await this.authRepository.findByEmail(email)

        if(userAlreadyExists){
            throw new Error("Email ja está em uso!");
        }

        // Cripitografar senha

        const hashedPassword = await bcrypt.hash(password, 10)
        
        // Criar usuário

        const user = await this.authRepository.create({
            name,
            email,
            password: hashedPassword
        })
        
        return{
            id: user.id,
            name: user.name,
            email: user.email,
        }
        
    }
}