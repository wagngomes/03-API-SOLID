import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'     
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './checkIn'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'


let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('checkIn use case', ()=> {

    beforeEach(async()=>{
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)
        vi.useFakeTimers()


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
        vi.useRealTimers()
    })

    it('should be able to check In', async () =>{

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        expect(checkIn.gym_id).toEqual('gym-01')

    })

    it('should not be able to check In twice in the same day', async () =>{

        vi.setSystemTime(new Date(2022, 0 ,20, 8, 0, 0))

        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        await expect(() =>
            sut.execute({
            gymId: "gym-02",
            userId: "user-02",
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
            })
        ).rejects.toBeInstanceOf(Error)     

    })

    it('should be able to check In twice in different days', async () =>{

        vi.setSystemTime(new Date(2022, 0 ,20, 8, 0, 0))

        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        vi.setSystemTime(new Date(2022, 0 ,22, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })

        expect(checkIn.gym_id).toEqual('gym-01')

    })

    it('should not be able to check in on distant gym', async () =>{

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'javascript academy',
            description: 'programming academy',
            phone: '8888888',
            latitude: new Decimal(-27.0747279),
            longitude: new Decimal(-49.4889672)
        })

        await expect(()=>
            sut.execute({
            gymId: "gym-02",
            userId: "user-01",
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        })
        ).rejects.toBeInstanceOf(Error)



    })

})