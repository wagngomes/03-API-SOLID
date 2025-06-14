import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInUseCase } from "../validate-check-in";

export function makeValidateCheckInsUseCase(){
    const checkInsRepository = new PrismaCheckInsRepository()
    const validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)

    return validateCheckInUseCase
}