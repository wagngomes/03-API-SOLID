import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('checkIns (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    it('should be abler to create a checkIn',async  () => {

        const { token } = await createAndAuthenticateUser(app)


        const gym = await prisma.gym.create({
            data: {
                title: 'rubi gym',
                latitude: -23.4606599,
                longitude: -46.5196154
            }
        })


        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'javascript gym',
                description: 'any description',
                phone: '11999877654',
                latitude: -23.4606599,
                longitude: -46.5196154
            })



        expect(response.statusCode).toEqual(201)
    })
})