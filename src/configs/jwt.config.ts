import crypto from 'crypto'

export const TOKEN_SECRET = crypto.randomBytes(256).toString('base64')
export const TOKEN_EXP = 60 * 60
export const REFRESH_TOKEN_EXP = 60 * 60 * 24 * 30