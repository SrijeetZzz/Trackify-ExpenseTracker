import RenderNavbar from "@/components/component/RenderNavbar";
import React, { useState } from "react";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
    <RenderNavbar/>
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Have questions? We'd love to hear from you. Fill out the form below
          and we’ll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form
          className="bg-slate-200 shadow-md rounded-lg p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {submitted && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md text-center">
              Thank you! Your message has been sent.
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-600 text-white font-semibold py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info (Dark Section) */}
        <div className="bg-gray-800 text-white rounded-lg p-8 space-y-6 shadow-md">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Office</h2>
            <p className="leading-relaxed">
              Trackify Pvt. Ltd.  
              <br />
              123 Finance Street  
              <br />
              Bangalore, India - 560001  
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
            <p className="leading-relaxed">
              📧 Email: support@trackify.com  
              <br />
              ☎️ Phone: +91 98765 43210
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">
                Facebook
              </a>
              <a href="#" className="hover:text-blue-300">
                Twitter
              </a>
              <a href="#" className="hover:text-pink-400">
                Instagram
              </a>
              <a href="#" className="hover:text-blue-500">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ContactUs;
