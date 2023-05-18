export interface IUser {
    name: string
    email: string
    image?: string
    password: string
}

export type IUserSecure = Omit<IUser, "password">