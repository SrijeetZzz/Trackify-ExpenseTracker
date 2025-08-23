import Navbar from '@/components/component/Navbar'
import SideBar from '@/components/component/SideBar'


const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <SideBar />
      </div>
    </div>
  )
}

export default Dashboard
