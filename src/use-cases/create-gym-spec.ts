import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'


let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('crate Gym use case', ()=> {

    beforeEach(()=>{

        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)

    })

    it('should be able to create a gym', async () =>{

        const { gym } = await sut.execute({
            title: 'Java',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091
        })
        expect(gym.id).toEqual(expect.any(String))    
    })
})
