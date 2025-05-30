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

    it('should be able to create a gym ',async  () => {

        const { token } = await createAndAuthenticateUser(app)

        const response = await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'javascript gym',
            description: 'any description',
            phone: '11999877654',
            latitude: -27.2092052,
            longitude: -59.6401091
        })

        expect(response.statusCode).toEqual(201)
    })
})