import { Request, Response } from 'express'
import { UserService } from '../services/UserService.js'
import { UserRepositoryMongo } from '../services/UserRepositoryMongo.js'
import { REFRESH_TOKEN_EXP, TOKEN_EXP } from '../configs/jwt.config.js'
import Joi from 'joi'

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const userService = new UserService(new UserRepositoryMongo(), {refreshTokenExpiration: REFRESH_TOKEN_EXP, tokenExpiration: TOKEN_EXP})

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const {value: {email, password}} = await loginSchema.validateAsync(req.body)
        const authResult = await userService.login({email, password})
        authResult.fold(
            err => {
                res.json(err)
            },
            value => {
                res.json(value)
            }
        )
    } catch (err) {
        res.json(err)
    }
}

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    image: Joi.string(),
    password: Joi.string().required()
})

export async function register(req: Request, res: Response): Promise<void> {
    try {
        const {value} = await registerSchema.validateAsync(req.body)
        const authResult = await userService.login(value)
        authResult.fold(
            err => {
                res.json(err)
            },
            value => {
                res.json(value)
            }
        )
    } catch (err) {
        res.json(err)
    }
}

export async function validate(req: Request, res: Response): Promise<void> {
    try {
        const authResult = await userService.validate({token: req.params.token})
        authResult.fold(
            err => {
                res.json(err)
            },
            value => {
                res.json(value)
            }
        )
    } catch(err) {
        res.json(err)
    }
}

export async function refresh(req: Request, res: Response): Promise<void> {
    try {
        const authResult = await userService.refresh({refreshToken: req.params.refreshToken})
        authResult.fold(
            err => {
                res.json(err)
            },
            value => {
                res.json(value)
            }
        )
    } catch (err) {
        res.json(err)
    }
}