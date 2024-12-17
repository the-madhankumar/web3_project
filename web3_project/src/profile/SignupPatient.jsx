import { useState } from "react";
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

function Signin() {
  const [errors, setErrors] = useState({}); // State for form validation errors
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  // Zod schema for validation
  const signupSchema = z.object({
    name: z.string().nonempty("Name is required."),
    email: z.string().email("Invalid email address."),
    phone: z
    .string()
    .length(10, "Phone number must be exactly 10 digits.")
    .regex(/^\d+$/, "Phone number must contain only digits."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validation = signupSchema.safeParse(data);

    if (!validation.success) {
      const errorMessages = validation.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      setSuccessMessage("");
      return;
    }

    setErrors({}); // Clear errors

    try {
      const response = await fetch("http://localhost:8000/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role:"patient"
        }),
      });
      
      const result  = await response.json();
      console.log(result);
      if (result.message === "Patient created successfully") {
        setSuccessMessage("Signup successful! You can now log in.");
      } else {
        const errorData = await response.json();
        setErrors({ server: errorData.message || "Signup failed. Try again." });
      }
    } catch (error) {
      setErrors({ server: "An error occurred. Please try again later." });
    }
  };

  return (
    <div className="max-h-1 min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-sm bg-white p-2 rounded-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up as Patient</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Username"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone No.</Label>
                <Input
                  id="phone"
                  name="phone"
                  type= "text"
                  placeholder="Phone No."
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
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
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              {errors.server && (
                <p className="text-red-500 text-sm mt-2">{errors.server}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm mt-2">{successMessage}</p>
              )}
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account? {" "}
            <a href="/login" className="underline">
              Log In
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signin;
