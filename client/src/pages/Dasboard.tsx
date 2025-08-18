// import Navbar from '@/components/component/Navbar'
// import SideBar from '@/components/component/SideBar'
// import React from 'react'

// const Dasboard = () => {
//   return (
//     <div>
//          <Navbar/>
//         <SideBar/>
//     </div>
//   )
// }

// export default Dasboard

import Navbar from '@/components/component/Navbar'
import SideBar from '@/components/component/SideBar'
import React from 'react'

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
