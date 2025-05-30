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

    it('should be able to list a history of checkins',async  () => {

        const { token } = await createAndAuthenticateUser(app)

        const user  = await prisma.user.findFirstOrThrow()


        const gym = await prisma.gym.create({
            data: {
                title: 'rubi gym',
                latitude: -23.4606599,
                longitude: -46.5196154
            }
        })

        const checkIns = await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: user.id

                },
                {
                    gym_id: gym.id,
                    user_id: user.id

                }
            ]
        })

        const response = await request(app.server)
            .post(`/check-ins/history`)
            .set('Authorization', `Bearer ${token}`)
            .send()
        
        expect(response.statusCode).toEqual(200)
        
    })
})