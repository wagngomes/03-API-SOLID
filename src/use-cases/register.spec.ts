import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'       


let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('register use case', ()=> {

    beforeEach(()=>{
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should hash user password upon registration', async () =>{

        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john@exemple.com',
            password: '123456'
        })

        const doesPasswordCorrectlyHashed = await compare('123456', user.password_hash)
        expect(doesPasswordCorrectlyHashed).toBe(true)

    })

    it('should not be able to register with same email twice', async () =>{

        const email = 'john@exemple.com'

        await sut.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })

        await expect(() => sut.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })).rejects
    })

    it('should be able to register', async () =>{

        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john@exemple.com',
            password: '123456'
        })
        expect(user.id).toEqual(expect.any(String))    
    })
})