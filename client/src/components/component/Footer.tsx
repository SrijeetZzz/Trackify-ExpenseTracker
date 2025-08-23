import React from "react";
import  Logo  from "../../assets/Trackify.png"; 
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo & Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Trackify Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Trackify</span>
          </div>
          <p className="text-gray-400 text-sm">
            Trackify simplifies your personal and shared finances with tools for expense tracking, 
            budgeting, Splitwise integration, and planning future expenses.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="hover:text-blue-500"><Facebook className="w-5 h-5"/></a>
            <a href="#" className="hover:text-blue-400"><Twitter className="w-5 h-5"/></a>
            <a href="#" className="hover:text-pink-500"><Instagram className="w-5 h-5"/></a>
            <a href="#" className="hover:text-blue-700"><Linkedin className="w-5 h-5"/></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/")}>Home</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/about")}>About Us</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/services")}>Services</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/contact")}>Contact</li>
          </ul>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-white font-semibold mb-4">Features</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">Expense Tracker</li>
            <li className="hover:text-white cursor-pointer">Splitwise Integration</li>
            <li className="hover:text-white cursor-pointer">Expense Planner</li>
            <li className="hover:text-white cursor-pointer">Analytics Dashboard</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400 text-sm mb-2">Email: support@trackify.com</p>
          <p className="text-gray-400 text-sm mb-2">Phone: +1 (123) 456-7890</p>
          <p className="text-gray-400 text-sm">Address: 123 Finance St, Suite 100, City, Country</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Trackify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
