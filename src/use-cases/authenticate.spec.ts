import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { describe, it, expect, beforeEach } from "vitest"
import { AuthenticateUseCase } from "./authenticate"
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from "@/errors/invalid-credentials-error"


let userRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('authenticate use case',() => {

    beforeEach(()=>{
        userRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(userRepository)

    })

    it('should be able to authenticate', async () => {

        await userRepository.create({
            name: 'john doe',
            email:'John@exemple.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            email:'John@exemple.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))

    })
    it('should not be able to authenticate with wrong email', async() => {


        await userRepository.create({
            name: 'john doe',
            email:'John@exemple.com',
            password_hash: await hash('123456', 6)
        })

        await expect(()=> sut.execute({
            email:'John@exemplex.com',
            password: '123456'
        })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)

    })

    it('should not be able to authenticate with wrong password', async() => {

        await userRepository.create({
            name: 'john doe',
            email:'John@exemple.com',
            password_hash: await hash('123456', 6)
        })

        await expect(()=> sut.execute({
            email:'John@exemple.com',
            password: '12345x'
        })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)

    })
})