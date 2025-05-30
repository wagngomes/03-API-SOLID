import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create_gym-use-case";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";


export async function create(request: FastifyRequest, reply: FastifyReply){
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180
        })
    })

    const {title, description, phone, latitude, longitude} = createGymBodySchema.parse(request.body)

    try{
        const createGymUseCase = makeCreateGymUseCase()

        await createGymUseCase.execute({title, description, phone, latitude, longitude})

    }catch(err){

        if( err instanceof ResourceNotFoundError){
            return reply.status(409).send({message: err.message})
        }
        
        throw err
    }
    return reply.status(201).send()
}