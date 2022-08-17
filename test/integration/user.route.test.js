const axios = require('axios').default
const { Client } = require('pg')
require('dotenv').config()

const client = new Client({
    connectionString: process.env.TEST_DATABASE_URL
})

let visitorToken, visitorId
let memberToken
let coordinatorToken

beforeAll(async () => {
    await client.connect()
    await client.query(`
    DELETE FROM public."Authorization";
    DELETE FROM public."Equipment";
    DELETE FROM public."Relatory";
    DELETE FROM public."Reservation";
    DELETE FROM public."User" WHERE ID NOT BETWEEN 26 AND 28;
    `)

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

    try {
        request = await axios.post('http://localhost:3001/auth/login', {
            email: 'member@email.com',
            password: '12345678'
        })

        memberToken = request.data.token
    }
    catch (err) {
        console.log(err.response)
        throw err
    }

    try {
        request = await axios.post('http://localhost:3001/auth/login', {
            email: 'coordinator@email.com',
            password: '12345678'
        })

        coordinatorToken = request.data.token
    }
    catch (err) {
        console.log(err.response)
        throw err
    }
})

describe('POST /user/', () => {
    it('Created 201 (Member -> Authorization)', async () => {
        let request
        try {
            request = await axios.post('http://localhost:3001/user/', {
                cardid: '0000000003',
                name: 'Test route',
                email: 'test@email.com',
                password: '12345678',
                type: 'Member',
            })
        }
        catch (err) {
            console.error(err.response)
            request = err.response
        }

        expect(request.status).toEqual(201)

        const { rows } = await client.query(`SELECT data FROM public."Authorization" where id = ${request.data.id}`)
        expect(rows[0].data.name == 'Test route').toBeTruthy()
    })

    it('Created 201 (Visitor -> User)', async () => {
        let request
        try {
            request = await axios.post('http://localhost:3001/user/', {
                name: 'Test route',
                email: 'test2@email.com',
                password: '12345678',
                type: 'Visitor',
            })
        }
        catch (err) {
            request = err.response
        }

        expect(request.status).toEqual(201)

        const { rows } = await client.query(`SELECT name FROM public."User" where id = ${request.data.id}`)
        expect(rows[0].name == 'Test route').toBeTruthy()
        visitorId = request.data.id
    })

    it('Bad Request 400', async () => {
        let request
        try {
            request = await axios.post('http://localhost:3001/user/')
        }
        catch (err) {
            request = err.response
        }

        expect(request.status).toEqual(400)
    })
})

describe('GET /user/', () => {
    it('OK 200 (Visitor self data)', async () => {
        let request
        try {
            request = await axios.get('http://localhost:3001/user/',
                {
                    headers: {
                        Authorization: visitorToken
                    }
                })
        }
        catch (err) {
            console.log(err.response)
            request = err.response
        }

        expect(request.status).toEqual(200)
        expect(request.data.email).toBe('visitor@email.com')
    })

    it('OK 200 (Member self data)', async () => {
        let request
        try {
            request = await axios.get('http://localhost:3001/user/',
                {
                    headers: {
                        Authorization: memberToken
                    }
                })
        }
        catch (err) {
            console.log(err.response)
            request = err.response
        }

        expect(request.status).toEqual(200)
        expect(request.data.name).toBe('Member')
    })

    it('OK 200 (Coordinator self data)', async () => {
        let request
        try {
            request = await axios.get('http://localhost:3001/user/',
                {
                    headers: {
                        Authorization: coordinatorToken
                    }
                })
        }
        catch (err) {
            console.log(err.response)
            request = err.response
        }

        expect(request.status).toEqual(200)
        expect(request.data.name).toBe('Coordinator')
    })

    it('OK 200 (Coordinator get Member data)', async () => {
        let request
        try {
            request = await axios.get('http://localhost:3001/user/',
                {
                    data: {
                        email: 'member@email.com'
                    },
                    headers: {
                        Authorization: coordinatorToken
                    }
                })
        }
        catch (err) {
            console.log(err.response)
            request = err.response
        }

        expect(request.status).toEqual(200)
        expect(request.data.name).toBe('Member')
    })

    it('OK 200 (Member try get visitor data)', async () => {
        let request
        try {
            request = await axios.get('http://localhost:3001/user/',
                {
                    data: {
                        email: 'visitor@email.com'
                    },
                    headers: {
                        Authorization: memberToken
                    }
                })
        }
        catch (err) {
            console.log(err.response)
            request = err.response
        }

        expect(request.status).toEqual(200)
        expect(request.data.name).toBe('Member')
    })

    it('OK 200 (Coordinator get all users)', async () => {
        let request
        try {
            request = await axios.get('http://localhost:3001/user/',
                {
                    data: {
                        getAll: true
                    },
                    headers: {
                        Authorization: coordinatorToken
                    }
                })
        }
        catch (err) {
            console.log(err.response)
            request = err.response
        }

        expect(request.status).toEqual(200)
        expect(request.data.length).toBeGreaterThanOrEqual(3)
    })

    it('Not Found 404 (Coordinator try get missing data)', async () => {
        let request
        try {
            request = await axios.get('http://localhost:3001/user/',
                {
                    data: {
                        email: 'missing@email.com'
                    },
                    headers: {
                        Authorization: coordinatorToken
                    }
                })
        }
        catch (err) {
            request = err.response
        }

        expect(request.status).toEqual(404)
    })
})

describe('PATCH /user/', () => {
    it('OK 200 (Visitor patch self)', async () => {
        let request, tempVisitorToken
        try {
            request = await axios.post('http://localhost:3001/auth/login', {
                email: 'test2@email.com',
                password: '12345678'
            })
    
            tempVisitorToken = request.data.token
        }
        catch (err) {
            console.log(err.response)
            throw err
        }

        try {
            request = await axios.patch('http://localhost:3001/user/',
                {
                    modify: {
                        id: 1,
                        name: "Visitor Patched"
                    }
                },
                {
                    headers: {
                        Authorization: tempVisitorToken
                    }
                })
        }
        catch (err) {
            console.log(err.response)
            request = err.response
        }

        expect(request.status).toEqual(200)
        const { rows } = await client.query(`SELECT * FROM public."User" where id = ${visitorId}`)
        expect(rows[0].name == 'Visitor Patched').toBeTruthy()
    })

    it('Bad Request 400 (Visitor try patch self)', async () => {
        let request, tempVisitorToken
        try {
            request = await axios.post('http://localhost:3001/auth/login', {
                email: 'test2@email.com',
                password: '12345678'
            })
    
            tempVisitorToken = request.data.token
        }
        catch (err) {
            console.log(err.response)
            throw err
        }

        try {
            request = await axios.patch('http://localhost:3001/user/',
                {
                    modify: {
                        id: 1,
                        email: "visitor@email.com"
                    }
                },
                {
                    headers: {
                        Authorization: tempVisitorToken
                    }
                })
        }
        catch (err) {
            request = err.response
        }

        expect(request.status).toEqual(400)
    })
})

describe('DELETE /user/', () => {
    it('OK 200 (Visitor delete self)', async () => {
        let request, tempVisitorToken
        try {
            request = await axios.post('http://localhost:3001/auth/login', {
                email: 'test2@email.com',
                password: '12345678'
            })
    
            tempVisitorToken = request.data.token
        }
        catch (err) {
            console.log(err.response)
            throw err
        }

        try {
            request = await axios.delete('http://localhost:3001/user/',
                {
                    headers: {
                        Authorization: tempVisitorToken
                    }
                })
        }
        catch (err) {
            console.log(err.response)
            request = err.response
        }

        expect(request.status).toEqual(200)
        const { rows } = await client.query(`SELECT * FROM public."User" where id = ${visitorId}`)
        expect(rows.length == 0).toBeTruthy()
    })
})

afterAll(() => {
    client.end()
})