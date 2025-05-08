import { beforeEach, describe, expect, it } from 'vitest'     
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './checkIn'


let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('checkIn use case', ()=> {

    beforeEach(()=>{
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository)
    })

    it('should be able to check In', async () =>{

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01"
        })

        expect(checkIn.gym_id).toEqual('gym-01')

    })

})