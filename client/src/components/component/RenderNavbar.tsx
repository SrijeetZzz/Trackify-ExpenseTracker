import { useAuth } from '@/utils/auth'
import Navbar from './Navbar';
import LandingPageNavbar from './LandingPageNavbar';

const RenderNavbar = () => {

    const auth = useAuth();
    const userId = auth?.userId
    const localUserId = localStorage.getItem("userId")
  return (
    <>
    {(localUserId!=null || userId!=null) && (userId===localUserId) ? <Navbar/> : <LandingPageNavbar/>}
    </>
  )
}

export default RenderNavbar