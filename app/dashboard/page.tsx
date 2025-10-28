import { signOut } from "../login/actions";



const Dashboard = () => {

  return (
    <>
    <p>Thi is a dashboard</p>
    <button onClick={signOut}>Sign Out</button>
    </>

  )
}

export default Dashboard;