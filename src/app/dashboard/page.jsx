import getAuthUser from "../../lib/getAuthUser";
import { getCollection } from "../../lib/db";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { deletePost } from "../../actions/post";

const Dashboard = async () => {

  const user = await getAuthUser()

  const postsCollection = await getCollection('posts')
  const userPosts = await postsCollection?.
    find({ userId: ObjectId.createFromHexString(user.userId) })
    .sort({ $natural: -1 })
    .toArray()

  if (!userPosts) return <p>Failed to fetch the data</p>

  if (userPosts.length === 0) return <p>You Don't have any posts</p>

  return (
    <div >
      <h1 className="title">
        Dashboard
      </h1>

      <table>
        <thead>
          <tr>
            <th className="w-3/6">Title</th>
            <th className="w-1/6 sr-only">View</th>
            <th className="w-1/6 sr-only">Edit</th>
            <th className="w-1/6 sr-only">Delete</th>
          </tr>
        </thead>
        <tbody>
          {userPosts.map((post) => (
            <tr key={post._id.toString()}>
              <td className="w-3/6">{post.title}</td>
              <td className="w-1/6 text-blue-500">
                <Link href={`/posts/show/${post._id.toString()}`}>View</Link>
              </td>
              <td className="w-1/6 text-green-500">
                <Link href={`/posts/edit/${post._id.toString()}`}>Edit</Link>
              </td>
              <td className="w-1/6 text-red-500">
                <form action={deletePost}>
                  <input type="hidden" name="postId" defaultValue={post._id.toString()}/>
                  <button>Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard