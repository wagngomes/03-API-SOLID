import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })
    afterAll(async () => {
        await app.close()
    })

    it('should be able to find a nearby gym ',async  () => {

        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'javascript gym',
            description: 'any description',
            phone: '11999877654',
            latitude: -27.2092052,
            longitude: -59.6401091
        })

        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'rubi gym',
            description: 'any description',
            phone: '11999877654',
            latitude: -23.4606599,
            longitude: -46.5196154
        })

        const response = await request(app.server)
        .get('/gyms/nearby')
        .query({
            latitude: -27.2092052,
            longitude: -59.6401091           
        })
        .set('Authorization', `Bearer ${token}`)
        .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([expect.objectContaining({title: 'javascript gym'})])

    })
})