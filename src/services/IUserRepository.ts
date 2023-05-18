import { IUser } from "../models/IUser.js"
import { Either } from "../utils/Either.js"

export interface IUserRepository {
    create(data: IUser): Promise<Either<string, IUser & {id: string}>>
    find(filter:{id?: string, email?: string}): Promise<Either<string, IUser & {id: string}>>
    update(filter:{id?: string, email?: string}, data: IUser): Promise<Either<string, {matched: number, modified: number}>>
    delete(filter:{id?: string, email?: string}): Promise<Either<string, {deleted: number}>>
}
