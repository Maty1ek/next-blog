'use client'
import { useActionState } from "react"

const BlogForm = ({ handler, post }) => {

    const [state, action, isPending] = useActionState(handler, undefined)

    return (
        <div>
            <form action={action}>
                <input type="hidden" name="postId" defaultValue={post?._id} />
                <div className="mb-3">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" defaultValue={state?.title || post?.title} />
                    {state?.errors?.title && (
                        <p className="error">{state.errors.title}</p>
                    )}
                </div>

                <div className="mb-8">
                    <label htmlFor="content">Content</label>
                    <textarea name="content" rows='6' defaultValue={state?.content || post?.content}></textarea>
                    {state?.errors?.content && (
                        <p className="error">{state.errors.content}</p>
                    )}
                </div>

                <button disabled={isPending} className='btn-primary'>{isPending ? 'Loading...' : 'Submit'}</button>
            </form>
        </div>
    )
}

export default BlogForm