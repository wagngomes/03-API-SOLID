import { FastifyReply, FastifyRequest } from "fastify";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";


export async function metrics(request: FastifyRequest, reply: FastifyReply){

    try{

        const getUserMetricsUseCase = makeGetUserMetricsUseCase()

        const { checkInsCount } = await getUserMetricsUseCase.execute({
            userId: request.user.sub
        })
       
        return reply.status(200).send({ checkInsCount})

    }catch(err){

        if( err instanceof ResourceNotFoundError){
            return reply.status(409).send({message: err.message})
        }        
        throw err
    }
}