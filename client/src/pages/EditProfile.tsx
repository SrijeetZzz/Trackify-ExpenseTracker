import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/utils/axiosInstance";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/component/Navbar";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
  const API_URL = import.meta.env.VITE_API_URL; 

const EditProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();


  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/auth/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token");

      // prepare formData (so profile picture + fields are updated together)
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("phoneNo", user.phoneNo || "");
      formData.append("budget", user.budget || 0);
      if (file) {
        formData.append("profilePicture", file);
      }

      await api.put("/auth/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // alert("Profile updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-[600px] p-8 bg-white shadow-lg rounded-2xl space-y-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-2 relative">
            <Avatar className="w-28 h-28">
              <AvatarImage
                src={
                  file
                    ? URL.createObjectURL(file)
                    : user?.profilePicture
                    ? `${API_URL}${user.profilePicture}`
                    : undefined
                }
                alt={user?.username || "Profile"}
              />
              <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
            </Avatar>

            {/* Upload Button */}
            <label className="absolute bottom-0 right-[40%] bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600">
              <Camera className="text-white w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label>Username</Label>
              <Input
                name="username"
                value={user?.username || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                name="email"
                value={user?.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                name="phoneNo"
                value={user?.phoneNo || ""}
                onChange={handleInputChange}
              />
            </div>
            {/* <div>
          <Label>Budget</Label>
          <Input
            type="number"
            name="budget"
            value={user?.budget || 0}
            onChange={handleInputChange}
          />
        </div> */}
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full" disabled={loading} >
            {loading ? <Spinner /> : "Save Changes"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
