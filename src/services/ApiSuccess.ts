import { HttpStatusSuccess } from "./HttpStatus.js"

export class ApiSuccess<T = undefined> {
    value?: T
    message: string
    status: HttpStatusSuccess
    token?: string
    refreshToken?: string
    constructor({value, message, status = HttpStatusSuccess.OK, token, refreshToken}:{value?: T, message: string, status: HttpStatusSuccess, token?: string, refreshToken?: string}) {
        this.value = value
        this.message = message
        this.status = status
        this.token = token
        this.refreshToken = refreshToken
    }
}