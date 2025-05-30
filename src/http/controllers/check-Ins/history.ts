import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-Ins-history-use-case";


export async function history(request: FastifyRequest, reply: FastifyReply){

    const checkInHistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1)
    })
        
    const { page } = checkInHistoryQuerySchema.parse(request.query)

    try{
       
        const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

        const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
            userId: request.user.sub,
            page
        })

        return reply.status(200).send({ checkIns})

    }catch(err){

        if( err instanceof ResourceNotFoundError){
            return reply.status(409).send({message: err.message})
        }
        
        throw err
    }

}