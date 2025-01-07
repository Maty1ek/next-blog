"use server"

import bcrypt from 'bcrypt'
import { LoginFormSchema, RegisterFormSchema } from "../lib/rules"
import { getCollection } from '../lib/db'
import { redirect } from 'next/navigation'
import { createSession } from '../lib/session'
import { error } from 'console'
import { cookies } from 'next/headers'

export async function register(state, formData) {

    const userEmail = formData.get('email')
    const userPassword = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    const validatedFields = RegisterFormSchema.safeParse({
        email: userEmail,
        password: userPassword,
        confirmPassword
    })
    

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            email: userEmail,
        }
    }

    const { email, password } = validatedFields.data

    const userCollection = await getCollection('blog_users')
    if (!userCollection) {
        return { errors: { email: 'Server error! ' } }
    }

    // Chaeck if email already registered
    const existingUser = await userCollection.findOne({ email })
    if (existingUser) {
        return { errors: { email: 'Email already exists in our database!' } }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Save in Data Base
    const results = await userCollection.insertOne({ email, password: hashedPassword })

    // Create a session
    await createSession(results.insertedId.toString())
    console.log(results);
    

    // Redirection
    redirect('/dashboard')
}

export async function login(state, formData) {
    const getEmail = formData.get('email')
    const getPassword = formData.get('password')

    // vValidate form fields
    const validatedFields = LoginFormSchema.safeParse({
        email: getEmail,
        password: getPassword
    })

    // If form fields are invalid
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // Extract form fields
    const {email, password} = validatedFields.data

    // Check if user exists
    const userCollection = await getCollection('blog_users')
    if(!userCollection) return {errors: {email: 'Server error! Please, try later.'}}

    const existingUser = await userCollection.findOne({email})
    if (!existingUser) return { errors: { email: 'Invalid credentials' } }

    // Check password
    const matchedPassword = await bcrypt.compare(password, existingUser.password)

    if (!matchedPassword) return { errors: { email: 'Invalid credentials' } }

    // Create a session
    await createSession(existingUser._id.toString())

    // Redirect
    redirect('/dashboard')
}

export async function logOut() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    redirect('/')
}