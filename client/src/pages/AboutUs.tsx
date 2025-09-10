import React, { useEffect, useState } from "react";
import bIone from "../assets/background-image.avif";
import bItwo from "../assets/backgroung-image2.jpg";
import bIthree from "../assets/backgrond-image3.avif";
import { useNavigate } from "react-router-dom";

import RenderNavbar from "@/components/component/RenderNavbar";

const images = [bIone, bItwo, bIthree];

const AboutUs: React.FC = () => {
  const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen">
    <RenderNavbar/>
      {/* Slideshow */}
      <div className="relative w-full h-72 sm:h-96 overflow-hidden">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt="About us"
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <section className="bg-transparent text-white text-center py-32 px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Welcome to Trackify
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto">
            Simplify your finances, track expenses, plan budgets, and manage shared expenses effortlessly.
          </p>
        </section>
        </div>
      </div>

      {/* Grid Section */}
      <section className="py-20 px-6 sm:px-12 bg-white text-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Our Mission */}
          <div className="p-8 rounded-xl bg-white shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="leading-relaxed text-gray-700">
              At <span className="font-semibold">Trackify</span>, our mission is
              to empower individuals and groups to take full control of their
              finances. Whether it’s recording daily expenses, planning monthly
              budgets, or managing group payments, we aim to make money
              management <strong>simpler, smarter, and stress-free</strong>.
            </p>
          </div>

          {/* Our Vision */}
          <div className="p-8 rounded-xl bg-gray-800 text-white shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="leading-relaxed">
              We envision a future where financial literacy and smart budgeting
              are accessible to everyone. By combining powerful tools with
              intuitive design, Trackify seeks to create a platform that helps
              people save more, spend wisely, and collaborate effortlessly on
              shared expenses.
            </p>
          </div>

          {/* Who We Are */}
          <div className="p-8 rounded-xl bg-gray-800 text-white shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="leading-relaxed">
              We are a passionate team of developers, designers, and finance
              enthusiasts who believe that <strong>money management</strong>
              should be as simple as possible. With experience in software,
              finance, and user-centric design, we are committed to building
              tools that are <em>both powerful and enjoyable</em>.
            </p>
          </div>

          {/* What We Do */}
          <div className="p-8 rounded-xl bg-white shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">What We Do</h2>
            <p className="leading-relaxed text-gray-700">
              Trackify provides a complete financial management suite: log daily
              expenses, split bills seamlessly with Splitwise integration, and
              plan your budget ahead with our monthly planner. Our goal is to
              help you{" "}
              <strong>
                stay organized, save money, and achieve your financial goals
              </strong>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 px-6 sm:px-12 text-center bg-gray-800 text-white">
        <h2 className="text-3xl font-bold mb-4">Join Us</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Whether you’re a user, partner, or future teammate, we invite you to
          be part of the Trackify journey. Together, we can make personal and
          group finance management effortless and empowering.
        </p>
        <button className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition" onClick={()=>navigate("/signup")}>
          Get Started
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
