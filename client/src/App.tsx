import SignUp from "./components/component/SignUp";
import Login from "./components/component/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/component/SideBar";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      {/* <SignUp/>
      <Login/> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<SideBar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
