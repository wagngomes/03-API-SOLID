import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { makeValidateCheckInsUseCase } from "@/use-cases/factories/make-validate-check-ins-use-case";


export async function validate(request: FastifyRequest, reply: FastifyReply){

    const validateCheckInsParamsSchema = z.object({
        checkInId: z.string().uuid()
    })
        
    const { checkInId } = validateCheckInsParamsSchema.parse(request.params)

    try{
       
        const validateCheckInUseCase = makeValidateCheckInsUseCase()

        await validateCheckInUseCase.execute({
            checkInId,
        })

    }catch(err){

        if( err instanceof ResourceNotFoundError){
            return reply.status(409).send({message: err.message})
        }
        
        throw err
    }
    return reply.status(204).send()
}