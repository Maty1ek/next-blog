import BlogForm from '../../../components/BlogForm'
import {createPost} from '../../../actions/post'

export default function create() {
    return (
        <div className="container w-1/2">
            <h1 className="title">Create a new Post</h1>

            <BlogForm handler={createPost}/>
        </div>
    )
}