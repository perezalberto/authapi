import { IUser } from "../models/IUser.js"
import { Either } from "../utils/Either.js"
import { IUserRepository } from "./IUserRepository.js"
import { db } from "../database/mongodb.js"
import { ObjectId } from "mongodb"

export class UserRepositoryMongo implements IUserRepository {
    constructor() {
        db.collection("users").createIndex({email: 1},{unique: true})
    }

    async create(data: IUser): Promise<Either<string, IUser & { id: string }>> {
        try {
            const userResult = await db.collection("users").insertOne(data)
            return Either.right({
                id: userResult.insertedId.toString(),
                ...data,
            })
        } catch (_) {
            return Either.left("User not created")
        }
    }
    async find({
        id,
        email,
    }: {
        id?: string | undefined
        email?: string | undefined
    }): Promise<Either<string, IUser & { id: string }>> {
        try {
            if (!id && !email) return Either.left("User not found")
            const filter = id ? { _id: new ObjectId(id) } : { email }
            const userResult = await db
                .collection("users")
                .findOne<IUser & { _id: ObjectId }>(filter)
            if (userResult) {
                return Either.right({
                    email: userResult.email,
                    id: userResult._id.toString(),
                    image: userResult.image,
                    name: userResult.name,
                    password: userResult.password,
                })
            }
            return Either.left("User not found")
        } catch (_) {
            return Either.left("User not found")
        }
    }
    async update(
        { id, email }: { id?: string | undefined, email?: string | undefined },
        data: IUser
    ): Promise<Either<string, { matched: number, modified: number }>> {
        try {
            if (!id && !email) return Either.left("User not updated")
            const filter = id ? { _id: new ObjectId(id) } : { email }
            const userResult = await db
                .collection("users")
                .updateOne(filter, data)
            return Either.right({
                matched: userResult.matchedCount,
                modified: userResult.modifiedCount,
            })
        } catch (_) {
            return Either.left("User not updated")
        }
    }
    async delete({
        id,
        email,
    }: {
        id?: string | undefined
        email?: string | undefined
    }): Promise<Either<string, { deleted: number }>> {
        try {
            if (!id && !email) return Either.left("User not removed")
            const filter = id ? { _id: new ObjectId(id) } : { email }
            const userResult = await db.collection("users").deleteOne(filter)
            return Either.right({ deleted: userResult.deletedCount })
        } catch (_) {
            return Either.left("User not removed")
        }
    }
}
