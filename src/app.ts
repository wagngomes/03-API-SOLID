import fastify from "fastify";
import { userRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-Ins/routes";

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})

app.register(userRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, request, reply)=>{

    if(error instanceof ZodError){
        return reply
        .status(400)
        .send({message: 'Validation error', issues: error.format()})
    }
    if (env.NODE_ENV !== 'production'){
        console.error(error)
    }

    return reply.status(500).send({message: 'internal server error'})

})