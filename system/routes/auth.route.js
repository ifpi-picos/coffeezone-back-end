module.exports = class AuthRoute {
    constructor(app) {
        // Set a new instance of a express router
        const { Router } = require('express');
        const routes = Router()

        // Set the services used on this route
        const AuthServices = require('../services/auth.service')
        const services = new AuthServices(app)

        // Set the routes
        routes.get("/login", (req, res) => {
        });

        // Return the path of this routes and the all seted router
        return { path: '/auth/', router: routes }
    }
}