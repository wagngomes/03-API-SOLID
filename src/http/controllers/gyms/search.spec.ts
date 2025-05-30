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

    it('should be able to search a gym ',async  () => {

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
            latitude: -27.2092052,
            longitude: -59.6401091
        })

        const response = await request(app.server)
        .get('/gyms/search')
        .query({
            q: 'javascript gym'
        })
        .set('Authorization', `Bearer ${token}`)
        .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)

    })
})