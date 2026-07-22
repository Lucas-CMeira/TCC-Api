import Fastify from "fastify"
import jwt from "@fastify/jwt"
import fastifyCors from "@fastify/cors"
import cookie from "@fastify/cookie"
import { authRoutes } from "./auth/auth.routes"
import { categoriesRoutes } from "./categories/categories.routes"
import { goalsRoutes } from "./goals/goals.routes"
import { entriesRoutes } from "./entries/entries.routes"
import registerPluggins from "./pluggins"

export default async function buildApp() {

    const app = Fastify()

    await app.register(fastifyCors, {
        origin: ["http://localhost:5173", "http://localhost:5174"],
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
    app.register(categoriesRoutes)
    app.register(goalsRoutes)
    app.register(entriesRoutes)

    return app
}