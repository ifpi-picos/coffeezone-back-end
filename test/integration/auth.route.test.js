const axios = require('axios').default
require('dotenv').config()

describe('POST /auth/login', () => {
    it('OK 200 (Visitor login)', async () => {
        let request
        try {
            request = await axios.post('http://localhost:3001/auth/login', {
                email: 'visitor@email.com',
                password: '12345678'
            })
    
            visitorToken = request.data.token
        }
        catch (err) {
            console.log(err.response)
            throw err
        }

        expect(request.data.token).toBeTruthy()
    })

    it('OK 200 (Member login)', async () => {
        let request
        try {
            request = await axios.post('http://localhost:3001/auth/login', {
                email: 'member@email.com',
                password: '12345678'
            })
    
            visitorToken = request.data.token
        }
        catch (err) {
            console.log(err.response)
            throw err
        }

        expect(request.data.token).toBeTruthy()
    })

    it('OK 200 (Coordinator login)', async () => {
        let request
        try {
            request = await axios.post('http://localhost:3001/auth/login', {
                email: 'coordinator@email.com',
                password: '12345678'
            })
    
            visitorToken = request.data.token
        }
        catch (err) {
            console.log(err.response)
            throw err
        }

        expect(request.data.token).toBeTruthy()
    })
})