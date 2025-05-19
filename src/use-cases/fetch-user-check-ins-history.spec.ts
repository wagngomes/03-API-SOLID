import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'     
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './checkIn'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'


let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('checkIn History use case', ()=> {

    beforeEach(async()=>{
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)


        await gymsRepository.create({
            id: 'gym-01',
            title: 'javascript academy',
            description: 'programming academy',
            phone: '8888888',
            latitude: -27.2092052,
            longitude: -49.6401091

        })
    })

    afterEach(()=>{

    })

    it('should be able to fetch checkIn history', async () =>{

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        expect(checkIn.gym_id).toEqual('gym-01')

    })



})