import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '../login/actions'
export default async function PrivatePage() {
  const supabase = await createClient()
  /*const { data, error } = await supabase.auth.getUser()
  console.log(data);
  if (error || !data?.user) {
    redirect('/login')
  }*/
  const {data, error } = await supabase.auth.getSession()
  console.log(data);
  if (!data) {
    return console.error("No session", error);
  }

  return (
    <>
    <p>Hello </p>
    <button onClick={signOut}>Sign Out</button>
    </>
    
  )
  
}