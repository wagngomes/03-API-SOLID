import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { describe, it, expect, beforeEach } from "vitest"
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from "./get-user-profile"


let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('get user profile use case',() => {

    beforeEach(()=>{
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)

    })

    it('should be able to get an user profile', async () => {

        const createdUser = await usersRepository.create({
            name: 'john doe',
            email:'John@exemple.com',
            password_hash: await hash('123456', 6)
        })


        const response = await sut.execute({ userId: createdUser.id })

        expect(response.user.name).toEqual('john doe')


    })
    it('should not be able to get an user profile with a wrong id', async () => {

        const user = await usersRepository.create({
            name: 'john doe',
            email:'John@exemple.com',
            password_hash: await hash('123456', 6)
        })

        await expect(() => 
            sut.execute({ userId: 'non-existent-id' })
          ).rejects.toThrow()

    })


})