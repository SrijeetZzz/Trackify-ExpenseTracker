import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, X, Plus, Layers, Users, Calendar, Group } from "lucide-react";
import logo from "../../assets/Trackify.png";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/axiosInstance";
const API_URL = import.meta.env.VITE_API_URL; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/auth/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAction = (action: string) => {
    navigate(`/${id}/${action}`);
    setIsQuickAddOpen(false);
  };

  return (
    <div className="w-full shadow-md bg-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">Trackify</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <span
            className="cursor-pointer hover:text-gray-600"
            onClick={() => navigate("/about")}
          >
            About
          </span>
          <span
            className="cursor-pointer hover:text-gray-600"
            onClick={() => navigate("/services")}
          >
            Services
          </span>
          <span
            className="cursor-pointer hover:text-gray-600"
            onClick={() => navigate("/contact")}
          >
            Contact
          </span>
          <span
            className="cursor-pointer hover:text-gray-600"
            onClick={() => navigate(`/${id}/analytics`)}
          >
            Dashboard
          </span>
        </div>

        {/* Quick Add & Avatar */}
        <div className="hidden md:flex items-center gap-4 relative">
          {/* Quick Add Button */}
          <div className="relative">
            <Button
              variant="secondary"
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Quick Add
            </Button>

            {isQuickAddOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 grid grid-cols-2 gap-2 z-50">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-1"
                  onClick={() => handleAction("expense")}
                >
                  <Plus className="w-4 h-4" /> Expense
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-1"
                  onClick={() => handleAction("categories")}
                >
                  <Layers className="w-4 h-4" /> Category
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-1"
                  onClick={() => handleAction("splitwise")}
                >
                  <Users className="w-4 h-4" /> Splitwise
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-1"
                  onClick={() => handleAction("groups")}
                >
                  <Group className="w-4 h-4" /> Groups
                </Button>
              </div>
            )}
          </div>

          {/* Avatar & Username */}
          <div className="flex items-center gap-2 relative">
            <Avatar
              onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
              className="cursor-pointer"
            >
              <AvatarImage
                src={
                  user?.profilePicture
                    ? `${API_URL}${user.profilePicture}`
                    : undefined
                }
                alt={user?.username || "Profile"}
              />
              <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <span className="font-medium">
              Hello, {user?.username || "User"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
            >
              ▼
            </Button>

            {isAvatarMenuOpen && (
              <div className="absolute right-0 mt-[140px] w-36 bg-white border rounded-md shadow-lg z-50">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2"
                  onClick={() => {
                    navigate(`/edit-profile/${id}`);
                    setIsAvatarMenuOpen(false);
                  }}
                >
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-inner px-6 py-4 space-y-4">
          <div className="hidden md:flex items-center gap-6">
            <span
              className="cursor-pointer hover:text-gray-600"
              onClick={() => navigate("/about")}
            >
              About
            </span>
            <span
              className="cursor-pointer hover:text-gray-600"
              onClick={() => navigate("/services")}
            >
              Services
            </span>
            <span
              className="cursor-pointer hover:text-gray-600"
              onClick={() => navigate("/contact")}
            >
              Contact
            </span>
            <span
            className="cursor-pointer hover:text-gray-600"
            onClick={() => navigate(`/${id}/analytics`)}
          >
            Dashboard
          </span>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button
              variant="secondary"
              onClick={() => handleAction("add-expense")}
            >
              <Plus className="w-4 h-4 mr-1" /> Expense
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleAction("add-category")}
            >
              <Layers className="w-4 h-4 mr-1" /> Category
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleAction("splitwise")}
            >
              <Users className="w-4 h-4 mr-1" /> Splitwise
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleAction("expense-planner")}
            >
              <Calendar className="w-4 h-4 mr-1" /> Planner
            </Button>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Avatar
              onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
              className="cursor-pointer"
            >
              <AvatarImage
                src={
                  user?.profilePicture
                    ? `http://localhost:5000${user.profilePicture}`
                    : undefined
                }
                alt={user?.username || "Profile"}
              />
              <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <span className="font-medium">
              Hello, {user?.username || "User"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
