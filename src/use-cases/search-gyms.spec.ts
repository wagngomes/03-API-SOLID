import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'     
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'


let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search gyms use case', ()=> {

    beforeEach(async()=>{
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })

    afterEach(()=>{

    })

    it('should be able to search for gyms', async () =>{

        await gymsRepository.create({
            title: 'java gym',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        await gymsRepository.create({
            title: 'python gym',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091
        })



        const { gyms } = await sut.execute({
            query: 'java gym',
            page: 1
        })

        expect(gyms).toHaveLength(1)


    })

   

})