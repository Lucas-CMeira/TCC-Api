import Fastify from "fastify"
import jwt from "@fastify/jwt"

import { authRoutes } from "./auth/auth.routes"
import registerPluggins from "./pluggins"

export default async function buildApp() {

    const app = Fastify()

    app.register(registerPluggins)

    app.register(jwt, {
        secret: "granafy-secret"
    })

    app.register(authRoutes)

    return app
}