import { IUser, IUserSecure } from "../models/IUser.js"
import { Crypt } from "../utils/Crypt.js"
import { Either } from "../utils/Either.js"
import { AccessToken } from "../utils/AccessToken.js"
import { ApiError } from "./ApiError.js"
import { ApiSuccess } from "./ApiSuccess.js"
import { HttpStatusError, HttpStatusSuccess } from "./HttpStatus.js"
import { IUserRepository } from "./IUserRepository.js"
import { RefreshToken } from "../utils/RefreshToken.js"

export class UserService {
    private userRepository: IUserRepository
    private tokenExpiration: number
    private refreshTokenExpiration: number

    constructor(userRepository: IUserRepository, config: {tokenExpiration: number, refreshTokenExpiration: number}) {
        this.userRepository = userRepository
        this.tokenExpiration = config.tokenExpiration
        this.refreshTokenExpiration = config.refreshTokenExpiration
    }

    async login(loginData: {email: string, password: string}): Promise<Either<ApiError, ApiSuccess<IUserSecure>>> {
        const userResponse = await this.userRepository.find({email: loginData.email})
        const userData = userResponse.getOrNull()
        if(userData !== null && Crypt.compare(loginData.password, userData.password)) {
            return Either.right(new ApiSuccess({
                value: {
                    ...userData,
                    password: undefined
                },
                message: "User Found",
                status: HttpStatusSuccess.OK,
                token: AccessToken.create({
                    id: userData.id,
                    email: userData.email
                }, this.tokenExpiration),
                refreshToken: RefreshToken.create(userData.id, this.refreshTokenExpiration).refreshToken
            }))
        }
        return Either.left(new ApiError({
            error: "Incorrect username or password",
            status: HttpStatusError.UNAUTHORIZED
        }))
    }

    async register(data: IUser): Promise<Either<ApiError, ApiSuccess<IUserSecure>>> {
        data.password = Crypt.hash(data.password)
        const userResponse = await this.userRepository.create(data)
        const userData = userResponse.getOrNull()
        if(userData) {
            return Either.right(new ApiSuccess({message: "User Created", status: HttpStatusSuccess.CREATED}))
        }
        return Either.left(new ApiError({error: "User Not Created", status: HttpStatusError.BAD_REQUEST}))
    }

    async validate(data: {token: string}): Promise<Either<ApiError, ApiSuccess>> {
        const tokenData = AccessToken.verify(data.token)
        if(!tokenData){
            return Either.left(new ApiError({error: "Invalid Token", status: HttpStatusError.UNAUTHORIZED}))
        }
        return Either.right(new ApiSuccess({message: "Valid Token", status: HttpStatusSuccess.OK}))
    }

    async refresh(data: {refreshToken: string}): Promise<Either<ApiError, ApiSuccess>> {
        const refreshTokenData = RefreshToken.verify(data.refreshToken)
        if(!refreshTokenData) {
            return Either.left(new ApiError({error: "Invalid Refresh Token", status: HttpStatusError.UNAUTHORIZED}))
        }
        const userResponse = await this.userRepository.find({id: refreshTokenData.userId})
        const userData = userResponse.getOrNull()
        if(!userData) {
            return Either.left(new ApiError({error: "Invalid Refresh Token", status: HttpStatusError.UNAUTHORIZED}))
        }
        RefreshToken.delete(data.refreshToken)
        return Either.right(new ApiSuccess({
            message: "ok",
            status: HttpStatusSuccess.OK,
            refreshToken: RefreshToken.create(refreshTokenData.userId, this.refreshTokenExpiration).refreshToken,
            token: AccessToken.create({
                id: userData.id,
                email: userData.email
            }, this.tokenExpiration),
        }))
    }
}