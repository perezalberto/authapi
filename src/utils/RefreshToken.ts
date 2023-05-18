import crypto from 'crypto'

export class RefreshToken {
    private static tokenList = new Map<string, {userId: string, exp: number}>()

    static init() {
        setInterval(() => {
            RefreshToken.clearExpiredTokens()
        }, 1000 * 60 * 60)
    }

    static create(userId: string, expiresIn: number): {refreshToken: string} {
        const newToken = crypto.randomBytes(256).toString("base64url")
        RefreshToken.tokenList.set(newToken, {userId, exp: Math.floor(Date.now() / 1000) + expiresIn})
        return {refreshToken: newToken}
    }

    static verify(refreshToken: string): {userId: string, exp: number} | null {
        const tokenData = RefreshToken.tokenList.get(refreshToken)
        if(!tokenData) {
            return null
        }
        if (Date.now() / 1000 > tokenData.exp) {
            return null
        }
        return {userId: tokenData.userId, exp: tokenData.exp}
    }

    static delete(refreshToken: string): boolean {
        return RefreshToken.tokenList.delete(refreshToken)
    }

    static clearExpiredTokens() {
        const currentTimeInSeconds = Math.floor(Date.now() / 1000)
        RefreshToken.tokenList.forEach(
            (value, key) => currentTimeInSeconds > value.exp && RefreshToken.delete(key)
        )
    }
}