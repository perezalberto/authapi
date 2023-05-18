import { HttpStatusError } from "./HttpStatus.js"

export class ApiError {
    error: string
    status: HttpStatusError
    constructor({error, status = HttpStatusError.BAD_REQUEST}:{error: string, status: HttpStatusError}) {
        this.error = error
        this.status = status
    }
}