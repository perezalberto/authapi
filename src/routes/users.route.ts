import { Router } from 'express'
import * as users from '../controllers/users.controller.js'

export const usersRoute = Router()

usersRoute.post("/login", users.login)
usersRoute.post("/register", users.register)
usersRoute.get("/validate/:token", users.validate)
usersRoute.get("/refresh/:refreshToken", users.refresh)
