import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "../../assets/Trackify.png";
import { useNavigate } from "react-router-dom";

const LandingPageNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full shadow-md bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">Trackify</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => navigate("/about")}
          >
            About
          </span>
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => navigate("/services")}
          >
            Services
          </span>
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => navigate("/contact")}
          >
            Contact
          </span>
        </div>

        {/* Sign Up / Sign In Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
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
          <span className="block cursor-pointer hover:text-blue-600">Home</span>
          <span className="block cursor-pointer hover:text-blue-600">
            About
          </span>
          <span className="block cursor-pointer hover:text-blue-600">
            Services
          </span>
          <span className="block cursor-pointer hover:text-blue-600">
            Contact
          </span>

          <div className="flex flex-col gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageNavbar;
