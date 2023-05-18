import { Request, Response } from 'express'
import { UserService } from '../services/UserService.js'
import { UserRepositoryMongo } from '../services/UserRepositoryMongo.js'
import { REFRESH_TOKEN_EXP, TOKEN_EXP } from '../configs/jwt.config.js'
import Joi from 'joi'
import { ApiError } from '../services/ApiError.js'
import { HttpStatusError } from '../services/HttpStatus.js'

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const userService = new UserService(new UserRepositoryMongo(), {refreshTokenExpiration: REFRESH_TOKEN_EXP, tokenExpiration: TOKEN_EXP})

export async function login(req: Request, res: Response): Promise<void> {
    const {value: {email, password}, error} = loginSchema.validate(req.body)
    if(error) {
        res.json(new ApiError({error: error.message, status: HttpStatusError.BAD_REQUEST}))
        return
    }
    const authResult = await userService.login({email, password})
    authResult.fold(
        err => {
            res.json(err)
        },
        value => {
            res.json(value)
        }
    )
}

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    image: Joi.string(),
    password: Joi.string().required()
})

export async function register(req: Request, res: Response): Promise<void> {
    const {value, error} = registerSchema.validate(req.body)
    if(error) {
        res.json(new ApiError({error: error.message, status: HttpStatusError.BAD_REQUEST}))
        return
    }
    const authResult = await userService.register(value)
    authResult.fold(
        err => {
            res.json(err)
        },
        value => {
            res.json(value)
        }
    )
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
        const authResult = await userService.refresh({refreshToken: req.params.refreshtoken})
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