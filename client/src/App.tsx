import SignUp from "./components/component/SignUp";
import Login from "./components/component/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dasboard";
import Expense from "./pages/Expense";
import Splitwise from "./pages/Splitwise";
import ExpensePlanner from "./pages/ExpensePlanner";
import Categories from "./pages/Catgeories";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import EditProfile from "./pages/EditProfile";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import ContactUs from "./pages/ContactUs";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/component/ProtectedRoutes";
import Groups from "./pages/Groups";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="flex min-h-svh flex-col">
     
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/error-page" element={<ErrorPage />} />

          {/* Protected Routes */}
          <Route
            path="/:id"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="analytics" element={<Analytics />} />
            <Route path="expense" element={<Expense />} />
            <Route path="splitwise" element={<Splitwise />} />
            <Route path="expense-planner" element={<ExpensePlanner />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} />
            <Route path="groups" element={<Groups/>}/>
          </Route>

          <Route
            path="/edit-profile/:id"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
       <Toaster />
    </div>
  );
}

export default App;
