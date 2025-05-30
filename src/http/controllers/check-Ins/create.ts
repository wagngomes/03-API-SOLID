import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";


export async function create(request: FastifyRequest, reply: FastifyReply){

    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid()
    })
    
    const createCheckInBodySchema = z.object({

        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180
        })
        
    })
    
    const { gymId } = createCheckInParamsSchema.parse(request.params)
    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

    try{
        const checkInUseCase = makeCheckInUseCase()

        await checkInUseCase.execute({
            gymId,
            userId: request.user.sub,
            userLatitude: latitude,
            userLongitude: longitude
        })

    }catch(err){

        if( err instanceof ResourceNotFoundError){
            return reply.status(409).send({message: err.message})
        }
        
        throw err
    }
    return reply.status(201).send()
}