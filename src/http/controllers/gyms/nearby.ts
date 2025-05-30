import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";


export async function nearby(request: FastifyRequest, reply: FastifyReply){

    const nearbyGymsQuerySchema = z.object({
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180
        })
    })

    const { latitude, longitude} = nearbyGymsQuerySchema.parse(request.body)

    try{
        const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

        const { gyms } = await fetchNearbyGymsUseCase.execute({
            userLatitude: latitude,
            userLongitude: longitude
        })

        return reply.status(200).send({
            gyms,
        })

    }catch(err){

        if( err instanceof ResourceNotFoundError){
            return reply.status(409).send({message: err.message})
        }
        
        throw err
    }
 
}