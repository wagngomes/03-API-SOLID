import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";


export async function search(request: FastifyRequest, reply: FastifyReply){
    const searchGymsQuerySchema = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1)

    })

    const {q, page} = searchGymsQuerySchema.parse(request.params)

    try{
        const searchGymsUseCase = makeSearchGymsUseCase()

        const { gyms } = await searchGymsUseCase.execute({query: q, page})

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