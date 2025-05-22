import { MaxDistanceError } from "@/errors/max-distance-error"
import { MaxNumberOfCheckInsError } from "@/errors/max-number-of-check-ins-error"
import { ResourceNotFoundError } from "@/errors/resource-not-found-error"
import { CheckInsRepository } from "@/repositories/check-ins-repository"
import { GymsRepository } from "@/repositories/gyms-repository"
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates"
import { CheckIn, User } from "@prisma/client"

interface ValidateCheckInUseCaseRequest {
    checkInId: string
}

interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn

}

export class ValidateCheckInUseCase {

    constructor (
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ){}

    async execute({
        checkInId
    }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {

        const checkIn = await this.checkInsRepository.findById(checkInId)

        if(!checkIn){
            throw new ResourceNotFoundError()
        }

        checkIn.validated_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return { checkIn }

    }

}