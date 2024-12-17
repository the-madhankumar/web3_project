import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import DropDown from "@/components/demo/DropDown";   

function Login({ setIsLoggedIn , setRole , setEmail , setName , setPhone}) {
  const navigate = useNavigate();

  // State for error messages
  const [errors, setErrors] = useState({});

  // Zod schema for validation
  const loginSchema = z.object({
    email: z.string().email("Invalid email address.").nonempty("Email is required."),
    role: z.enum(["doctor", "patient" , "pharmist"], { required_error: "Role is required." }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long.")
      .nonempty("Password is required."),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
  
    const data = {
      email: formData.get("email"),
      role: formData.get("role"),
      password: formData.get("password"),
    };
    console.log(data)
    // Validate data with Zod
    const validation = loginSchema.safeParse(data);
    // console.log(validation)
    if (!validation.success) {
      const errorMessages = validation.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }
  
    setErrors({});
  
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result)
      console.log(result.user)
      if (result.message === "Login successful") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.email);
        localStorage.setItem("name", result.user.name);
        localStorage.setItem("phone", result.user.phone);
  
        setRole(data.role);
        setIsLoggedIn(true);
        setEmail(data.email);
        setName(result.user.name);
        setPhone(result.user.phone);
        console.log(data)
        navigate(data.role === "doctor" ? "/dashboard" : data.role=== "patient" ? "/dashboardpat" : "/qrfile");
      } else {
        // Show error from backend
        setErrors({ form: result.message || "Login failed. Please try again." });
      }
    } catch (error) {
      // Handle network or other errors
      setErrors({ form: "An error occurred. Please try again later." });
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="role">Role</Label>
                </div>
                <select
                  id="role"
                  name="role"
                  className={`bg-white text-sm border rounded-md p-2 ${
                    errors.role ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Role</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                  <option value="pharmist">pharmist</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account? <DropDown />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
