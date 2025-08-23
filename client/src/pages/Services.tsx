import React from "react";
import { useNavigate } from "react-router-dom";

const Services: React.FC = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Comprehensive Expense Tracking",
      description:
        "Log every expense quickly and accurately, whether it’s cash, card, or digital payment. Categorize your spending automatically or manually to see exactly where your money goes. Our intuitive dashboard helps you visualize your daily, weekly, and monthly expenses for smarter financial decisions.",
      icon: "account_balance_wallet", 
    },
    {
      title: "Splitwise Integration",
      description:
        "Easily split bills with friends, roommates, or colleagues without the confusion. Record shared expenses, track who owes whom, and settle balances seamlessly. Perfect for group outings, trips, or household bills, ensuring everyone pays their fair share without stress.",
      icon: "groups",
    },
    {
      title: "Monthly Expense Planner",
      description:
        "Plan your finances ahead with our monthly expense planner. Set budgets for each category such as groceries, entertainment, and bills, and track your progress in real-time. Receive alerts if you’re approaching your budget limits to stay on top of your financial goals.",
      icon: "calendar_month",
    },
    {
      title: "Analytics & Insights",
      description:
        "Gain deep insights into your spending patterns with charts, graphs, and detailed reports. Identify unnecessary expenses, track recurring payments, and compare monthly trends. Make informed decisions to save more and spend wisely.",
      icon: "query_stats",
    },
    {
      title: "Custom Categories & Tags",
      description:
        "Tailor your expense tracker to fit your lifestyle by creating custom categories and tags. Organize your expenses in a way that makes sense to you, whether it’s separating personal, work, or travel expenses.",
      icon: "label",
    },
    {
      title: "Secure Data & Cloud Sync",
      description:
        "Your financial data is secure with end-to-end encryption. Sync your expenses across multiple devices in real-time so you can access your records anytime, anywhere, without worry.",
      icon: "cloud_done",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Our Services
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Powerful tools to manage, plan, and split your expenses efficiently.
          Whether you are tracking personal spending or managing group expenses,
          our platform makes it easy.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, index) => {
          const isHighlighted = [1, 3, 5].includes(index);
          return (
            <div
              key={index}
              className={`rounded-lg p-8 flex flex-col items-center text-center shadow-md transition-shadow ${
                isHighlighted
                  ? "bg-gray-800 text-white hover:shadow-xl"
                  : "bg-white text-gray-900 hover:shadow-xl"
              }`}
            >
              <span className="material-symbols-outlined text-5xl mb-6">
                {service.icon}
              </span>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="leading-relaxed">{service.description}</p>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to take control of your finances?
        </h2>
        <p className="text-gray-700 mb-6">
          Sign up today and start tracking your expenses, splitting bills with
          friends, and planning your monthly budget with ease. Take the first
          step towards smarter financial management.
        </p>
        <button className="bg-gray-800 text-white font-semibold px-8 py-3 rounded-md hover:bg-gray-950 transition-colors" onClick={()=>navigate("/signup")}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Services;
