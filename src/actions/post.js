"use server"

import { redirect } from 'next/navigation'
import getAuthUser from "../lib/getAuthUser"
import { blogPostSchema } from "../lib/rules";
import { getCollection } from "../lib/db";
import { ObjectId } from "mongodb";
import { revalidatePath } from 'next/cache';

export async function createPost(state, formData) {
  // Check is user signed in
  const user = await getAuthUser()
  if (!user) return redirect("/")
  console.log(user);


  // Validate form fields
  const title = formData.get('title')
  const content = formData.get('content')


  const validatedFields = blogPostSchema.safeParse({
    title, content
  })

  // If any form fields are invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      title,
      content
    }
  }

  try {
    const postCollection = await getCollection('posts')
    const post = {
      title: validatedFields.data.title,
      content: validatedFields.data.content,
      userId: ObjectId.createFromHexString(user.userId)
    }
    await postCollection.insertOne(post)
  } catch (e) {
    return {
      errors: { title: error.message }
    }
  }

  redirect('/dashboard')
}

export async function updatePost(state, formData) {
  // Check is user signed in
  const user = await getAuthUser()
  if (!user) return redirct("/")

  // Validate form fields
  const title = formData.get('title')
  const content = formData.get('content')
  const postId = formData.get('postId')

  const validatedFields = blogPostSchema.safeParse({
    title, content
  })

  // If any form fields are invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      title,
      content
    }
  }

  // Find post we wanna update
  const postsCollection = await getCollection('posts')
  const post = await postsCollection.findOne({
    _id: ObjectId.createFromHexString(postId)
  })

  // Check if the user owns the id
  if (user.userId !== post.userId.toString()) {
    return redirect('/')
  }

  // Update the post
  postsCollection.findOneAndUpdate(
    { _id: post._id },
    {
      $set: {
        title: validatedFields.data.title,
        content: validatedFields.data.content,
      }
    }
  )

  redirect('/dashboard')
}

export async function deletePost(formData) {
  // Check is user signed in
  const user = await getAuthUser()
  if (!user) return redirct("/")

  // Find the Post
  const postsCollection = await getCollection('posts')
  const post = await postsCollection.findOne({_id: ObjectId.createFromHexString(formData.get('postId'))})

  // Check the auth user owns the post
  if(user.userId !== post.userId.toString()) return redirect('/')

  postsCollection.findOneAndDelete({_id: post._id})

  revalidatePath('/dashboard')
}