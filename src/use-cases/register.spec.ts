import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error'

describe('register use case', ()=> {

    it('should hash user password upon registration', async () =>{

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john@exemple.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)
        expect(isPasswordCorrectlyHashed).toBe(true)

    })

    it('should not be able to register with same email twice', async () =>{

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'john@exemple.com'

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })

        await expect(() => registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })).rejects
    })

    it('should be able to register', async () =>{

        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'John Doe',
            email: 'john@exemple.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    
    })
    

})