import "server-only"
import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.SESSION_SECRET
// The JOSE library wants your secret key as bytes (a Uint8Array), not a normal string. So TextEncoder converts the string version of your secret into the right format.
// Because “jose” expects a typed array to do the cryptographic signing, so we must convert the string key into bytes
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {

    return new SignJWT(payload)
        // algoritm
        .setProtectedHeader({ alg: "HS256" })
        // the moment u created it
        .setIssuedAt()
        // Tells the token to expire in 7 days from now
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session) {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algoritms: ['HS256']
        }) 
        return payload
    } catch (error) {
        console.log('Failed to verify session')
    }
}

export async function createSession(userId) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, expiresAt })
    const cookieStore = await cookies()


    cookieStore.set('session', session, {
        // Means JavaScript can’t read this cookie in the browser
        httpOnly: true,
        // Only send this cookie over HTTPS.
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        // The cookie is valid for the entire domain path.
        path: '/'
    })
}