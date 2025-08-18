
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../utils/auth";

const SignUp: React.FC = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const values = { email, password, fname, lname };

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/signup",
      values,
      { withCredentials: true }
    );

    if (res.status === 200) {
      const response = res.data;
      localStorage.setItem("token", response.accessToken);
      const decoded = useAuth();
      if (decoded && decoded.userId) {
        navigate(`/${decoded.userId}/analytics`);
      } else {
        console.error("Invalid token or missing userId");
      }
    } else {
      console.error("SignUp failed with status:", res.status);
    }
  } catch (err) {
    console.error("Signup error:", err);
  }

  setEmail("");
  setPassword("");
  setFname("");
  setLname("");
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle>Signup into your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="fname">First Name</Label>
                  <Input
                    id="fname"
                    type="text"
                    placeholder="Enter First Name"
                    value={fname}
                    required
                    onChange={(e) => setFname(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="lname">Last Name</Label>
                  <Input
                    id="lname"
                    type="text"
                    placeholder="Enter Last Name"
                    required
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            SignUp
          </Button>
          <Button variant="outline" className="w-full">
            SignUp with Google
          </Button>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
