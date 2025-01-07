import NavLink from './NavLink'
import getAuthUser from '../lib/getAuthUser'
import { logOut } from '../actions/auth';

export default async function Navigation() {

  const authUser = await getAuthUser()

  return (
    <nav>
      <NavLink label='Home' href='/' />
      {authUser ?
        (
          <div className='flex items-center'>
            <NavLink label='New Post' href='/posts/create' />
            <NavLink label='Dashboard' href='/dashboard' />
            <form action={logOut}>
              <button className='nav-link'>Log out</button>
            </form>
          </div>
        ) : (
          <div>
            <NavLink label='Login' href='/login' />
            <NavLink label='Register' href='/register' />
          </div>
        )
      }
    </nav>
  )
}

