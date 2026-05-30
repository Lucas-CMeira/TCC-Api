import Fastify from "fastify"
import jwt from "@fastify/jwt"
import fastifyCors from "@fastify/cors"
import cookie from "@fastify/cookie"
import { authRoutes } from "./auth/auth.routes"
import registerPluggins from "./pluggins"

export default async function buildApp() {

    const app = Fastify()

    await app.register(fastifyCors, {
        origin: "http://localhost:5173",
        credentials: true
    })


    await app.register(cookie)

    app.register(registerPluggins)

    app.register(jwt, {
        secret: "granafy-secret",
        cookie: {
            cookieName: "token",
            signed: false
        }
    })

    app.register(authRoutes)

    return app
}