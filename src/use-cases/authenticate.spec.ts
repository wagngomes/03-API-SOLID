import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { describe, it, expect } from "vitest"
import { AuthenticateUseCase } from "./authenticate"
import { hash } from 'bcryptjs'

describe('authenticate use case',() => {

    it('should be able to authenticate', async () => {

        const userRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(userRepository)

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
})