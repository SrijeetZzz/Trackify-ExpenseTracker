import { useState, useEffect } from "react";
import AddCategoryDialog from "@/components/component/AddCategory";
import AddSubCategoryDialog from "@/components/component/AddSubcategory";
import { api } from "@/utils/axiosInstance";
import ChartExpensesByCategory from "@/components/component/CategoryWiseExpense";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  // const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    // setLoading(true);
    try {
      if (!token || !userId) return;
      const res = await api.get(`/category/get-categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
// if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen w-[1200px]">
//         <Spinner />
//       </div>
//     );
  return (
    <div className="w-[1200px]">
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
