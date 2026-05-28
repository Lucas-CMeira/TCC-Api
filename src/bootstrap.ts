import Fastify from "fastify"
import jwt from "@fastify/jwt"
import fastifyCors from "@fastify/cors"

import { authRoutes } from "./auth/auth.routes"
import registerPluggins from "./pluggins"

export default async function buildApp() {

    const app = Fastify()

    await app.register(fastifyCors,{
        origin: "http://localhost:5173"
    });

    app.register(registerPluggins)

    app.register(jwt, {
        secret: "granafy-secret"
    })

    app.register(authRoutes)

    return app
}