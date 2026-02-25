import fastify from "fastify"

import registerPluggins from "./pluggins/index"

export default async function buildApp() {

    const app = fastify()

    await registerPluggins()

    return app
}