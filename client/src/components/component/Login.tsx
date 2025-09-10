
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
import { useToast } from "@/hooks/use-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // ✅ validation before API call
  if (!email || !password) {
    toast({
      variant: "destructive",
      title: "Missing fields ",
      description: "Please enter both email and password.",
    });
    return;
  }

  const values = { email, password };

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      values,
      { withCredentials: true }
    );

    if (res.status === 200) {
      const response = res.data;
      localStorage.setItem("token", response.accessToken);

      const auth = useAuth();
      const id = auth?.userId!;
      localStorage.setItem("userId", id);

      toast({
        title: "Login successful 🎉",
        description: "Welcome back!",
      });

      const decoded = useAuth();
      if (decoded && decoded.userId) {
        navigate(`/${decoded.userId}/analytics`);
      } else {
        toast({
          variant: "destructive",
          title: "Authentication error ❌",
          description: "Invalid token or missing userId.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Login failed ❌",
        description: `Server returned status ${res.status}`,
      });
    }
  } catch (err: any) {
    toast({
      variant: "destructive",
      title: "Login error",
      description: err?.response?.data?.message || "Something went wrong.",
    });
  }

  setEmail("");
  setPassword("");
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
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
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-medium text-gray-800 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
