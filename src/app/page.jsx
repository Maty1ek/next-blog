// "use client"
// import { useEffect } from "react";
// import myFunction from "../actions/myFunction";

import Link from "next/link";
import { getCollection } from "../lib/db";
import PostCard from '../components/PostCard'
import { Suspense } from "react";


export default async function Home() {
  const postsCollection = await getCollection('posts')
  const posts = await postsCollection?.find().sort({ $natural: -1 }).toArray()

  if (posts) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {
          posts.map((post) => (
            <div key={post._id}>
              <PostCard post={post} />
            </div>
          ))
        }
      </div>
    )
  } else {
    return <p>Failed to fetch the data from database</p>
  }
  // useEffect(() => {
  //   async function callMyFunction() {
  //     await myFunction()
  //   }
  //   callMyFunction()
  // }, [])

  // return (
    // <Suspense fallback={<p>Loading...</p>}>
    //   <PostList />
    // </Suspense>
  // )
}

// async function PostList() {
//   const postsCollection = await getCollection('posts')
//   const posts = await postsCollection?.find().sort({ $natural: -1 }).toArray()

//   if (posts) {
//     return (
//       <div className="grid grid-cols-2 gap-6">
//         {
//           posts.map((post) => (
//             <div key={post._id}>
//               <PostCard post={post} />
//             </div>
//           ))
//         }
//       </div>
//     )
//   } else {
//     return <p>Failed to fetch the data from database</p>
//   }
// }