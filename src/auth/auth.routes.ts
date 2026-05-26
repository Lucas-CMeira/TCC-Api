import { FastifyInstance } from "fastify";
import { AuthModule } from "./auth.module";

export async function authRoutes(app: FastifyInstance) {

    const authModule = new AuthModule(app)

    const authController = authModule.authController

    app.post(
        "/register",
        authController.register.bind(authController)
    )

    app.post(
        "/login",
        authController.login.bind(authController)
    )
}