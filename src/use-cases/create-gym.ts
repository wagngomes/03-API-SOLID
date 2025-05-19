import { UserAlreadyExistsError } from "@/errors/user-already-exists-error"
import { GymsRepository } from "@/repositories/gyms-repository"
import { UserRepository } from "@/repositories/users-repository"
import { Gym, User } from "@prisma/client"
import { hash } from "bcryptjs"


interface CreateGymUseCaseRequest {
    title: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number

}
interface CreateGymUseCaseResponse{
    gym: Gym
}

export class CreateGymUseCase {

    constructor(private gymsRepository: GymsRepository){}

    async execute({ title, description, phone, latitude, longitude }: CreateGymUseCaseRequest):Promise<CreateGymUseCaseResponse> {


        const gym =await this.gymsRepository.create({
             title,
             description,
             phone,
             longitude,
             latitude
        })
        return { gym }   
    }
}

