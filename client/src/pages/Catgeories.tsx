import { useState, useEffect } from "react";
import AddCategoryDialog from "@/components/component/AddCategory";
import AddSubCategoryDialog from "@/components/component/AddSubcategory";
import { api } from "@/utils/axiosInstance";
import  ChartExpensesByCategory  from "@/components/component/CategoryWiseExpense";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      if (!token || !userId) return;
      const res = await api.get(`/category/get-categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-[1180px]">
      {/* Buttons container */}
      <div className="flex justify-between mb-4">
        <AddCategoryDialog onCategoryAdded={fetchCategories} />
        <AddSubCategoryDialog categories={categories} />
      </div>

      {/* Chart */}
      <div className="w-full">
        <ChartExpensesByCategory />
      </div>
    </div>
  );
};

export default Categories;
