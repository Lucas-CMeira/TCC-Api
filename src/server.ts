import fastify from "fastify"

const app = fastify()

const port = 3333

app.listen({
    host: "0.0.0.0",
    port
}).then(() => {
    console.log("HTTP Server running on ", port, " port")
}).catch((e: any) => {
    console.log("Erro na hora de subir")
    console.log(e)
})