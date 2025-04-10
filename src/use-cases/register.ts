import { UserAlreadyExistsError } from "@/errors/user-already-exists-error"
import { prisma } from "@/lib/prisma"
import { UserRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"


interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

export class RegisterUseCase {

    constructor(private userRepository: UserRepository){}

    async execute({ name, email, password }: RegisterUseCaseRequest) {

        const password_hash = await hash(password, 6)
    
        const userWithSameEmail = await this.userRepository.findByEmail(email)
    
        if (userWithSameEmail) {
            throw new UserAlreadyExistsError
        }
        await this.userRepository.create({
            name,
            email,
            password_hash
        })   
    }
}

