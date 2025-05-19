import { CheckInsRepository } from "@/repositories/check-ins-repository"
import { CheckIn, User } from "@prisma/client"

interface FetchUserCheckInsHistoryUseCaseRequest {
    userId: string
}

interface FetchUserCheckInsHistoryUseCaseResponse {
    checkIns: CheckIn[]

}

export class FetchUserCheckInsHistoryUseCase {

    constructor (
        private checkInsRepository: CheckInsRepository,

    ){}

    async execute({userId }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {

        const checkIns = await this.checkInsRepository.findManyByUserId(userId)

        return { checkIns }

    }

}