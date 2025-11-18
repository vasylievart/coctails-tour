import { login, signup } from './actions'
export default function LoginPage() {
  return (
    <div className="flex h-screen justify-center  items-center">
      <div >
        <form className='flex flex-col gap-4 border-2 border-gray-500 rounded-lg p-4'>
          <label htmlFor="email">Email:</label>
          <input className='border border-gray-400 rounded-md shadow-md' id="email" name="email" type="email" required />
          <label htmlFor="password">Password:</label>
          <input className='border border-gray-400 rounded-md shadow-md' id="password" name="password" type="password" required />
          <div className='flex justify-between'>
            <button className='w-full p-2 border border-gray-400 rounded-lg shadow-lg' formAction={login}>Log in</button>
          </div> 
        </form>
      </div>
    </div>
  )
}