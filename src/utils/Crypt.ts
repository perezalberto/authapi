import bcrypt from "bcryptjs"

export class Crypt {
    /**
     * generates a hash for the given string
     * @param text String to hash
     * @returns Resulting hash
     */
    static hash(text: string) {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(text, salt)
    }

    /**
     * tests a string against a hash
     * @param text String to compare
     * @param hash Hash to test against
     * @returns true if matching, otherwise false
     */
    static compare(text: string, hash: string) {
        return bcrypt.compareSync(text, hash)
    }
}