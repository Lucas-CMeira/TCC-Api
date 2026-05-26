import Fastify from "fastify"
import jwt from "@fastify/jwt"

import { authRoutes } from "./auth/auth.routes"

export default async function buildApp() {

    const app = Fastify()

    app.register(jwt, {
        secret: "granafy-secret"
    })

    app.register(authRoutes)

    return app
}