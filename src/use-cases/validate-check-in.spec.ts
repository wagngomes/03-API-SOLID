import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'     
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './checkIn'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'


let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate checkIn use case', ()=> {

    beforeEach(async()=>{
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)
        vi.useFakeTimers()


       /*await gymsRepository.create({
            id: 'gym-01',
            title: 'javascript academy',
            description: 'programming academy',
            phone: '8888888',
            latitude: -27.2092052,
            longitude: -49.6401091

        })*/
    })

    afterEach(()=>{
        vi.useRealTimers()
    })

    it('should be able to validate the check-In', async () =>{

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        const { checkIn } =  await sut.execute({
            checkInId: createdCheckIn.id
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))

    })

    it('should be able to validate an inexistent check-In', async () =>{

        await expect(() => sut.execute({
            checkInId: 'inexistent check-in Id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)  

    })

    it('should not be able to validate the check in after 20 minutes of its creation', async () =>{

        vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        const twentyOneMinutesInMiliseconds = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMiliseconds)

        await expect(() => sut.execute({
            checkInId: createdCheckIn.id
        })).rejects.toBeInstanceOf(Error)
    })
    


})