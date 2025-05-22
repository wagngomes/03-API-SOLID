import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'     
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'


let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms use case', ()=> {

    beforeEach(async()=>{
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository)
    })

    afterEach(()=>{

    })

    it('should be able to fetch nearby gyms', async () =>{

        await gymsRepository.create({
            title: 'near gym',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        await gymsRepository.create({
            title: 'far gym',
            description: null,
            phone: null,
            latitude: -27.0610928,
            longitude: -49.5229501
        })



        const { gyms } = await sut.execute({
            userLatitude: -27.2092052,
            userLongitude: -49.6401091

        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({title: 'near gym'})])


    })
})