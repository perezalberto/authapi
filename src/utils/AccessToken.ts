import jwt from "jsonwebtoken"
import { TOKEN_SECRET } from "../configs/jwt.config.js"

export class AccessToken {
    static create(payload: object, expiresIn: number): string {
        return jwt.sign({...payload}, TOKEN_SECRET, {expiresIn})
    }

    static verify(token: string): jwt.JwtPayload | null {
        try {
            return jwt.verify(token, TOKEN_SECRET) as jwt.JwtPayload
        } catch (_) {
            return null
        }
    }
}
