import React from "react";

import AboutUs from "../pages/AboutUs";
import Services from "../pages/Services";
import Footer from "../components/component/Footer";


const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
         
    {/* <RenderNavbar/> */}

      {/* Main Content */}
      <main className="flex-grow">
        {/* About Us Section */}
        <AboutUs />

        {/* Services Section */}
        <Services />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
