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

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/:id" element={<Dashboard />}>
            <Route path="analytics" element={<Analytics />} />
            <Route path="expense" element={<Expense />} />
            <Route path="splitwise" element={<Splitwise />} />
            <Route path="expense-planner" element={<ExpensePlanner />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
