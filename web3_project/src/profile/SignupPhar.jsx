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

export default function SignupPhar() {
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Zod schema for validation
  const signupSchema = z
    .object({
      name: z
        .string()
        .min(4, "Name must be at least 4 characters long.")
        .max(40, "Name must be at most 40 characters long.")
        .nonempty("Name is required."),
      email: z.string().email("Invalid email address.").nonempty("Email is required."),
      phone: z
        .string()
        .length(10, "Phone number must be exactly 10 digits.")
        .regex(/^\d+$/, "Phone number must contain only digits."),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long.")
        .nonempty("Password is required."),
      confirmPassword: z.string().nonempty("Confirm password is required."),
      DLN: z.string().nonempty("Drug License Number is required."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      DLN: formData.get("DLN"),
      role: "pharmacist", // Default role
    };
    console.log(data)
    // Validate using Zod
    const validation = signupSchema.safeParse(data);
    console.log(validation)
    if (!validation.success) {
      const errorMessages = validation.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }

    // Send data to backend
    try {
      const response = await fetch("http://localhost:8000/pharm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: data.role,
          DLN: data.DLN,
        }),
      });
      const result = await response.json();
      if (!result.ok) {
        setErrors({ general: result.message || "An error occurred" });
      } else {
        setErrors({});
        setSuccessMessage("Signup successful! Redirecting...");
        console.log("User registered successfully.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrors({ general: "Failed to connect to the server." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-xl bg-white p-4 rounded-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up as Pharmacist</CardTitle>
          <CardDescription>
            Enter your details below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Pharmacist Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
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
                <Label htmlFor="phone">Mobile No.</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Mobile No."
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
                  placeholder="Confirm password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="DLN">Drug License Number</Label>
                <Input
                  id="DLN"
                  name="DLN"
                  type="text"
                  placeholder="Drug License Number"
                  className={errors.DLN ? "border-red-500" : ""}
                />
                {errors.DLN && (
                  <p className="text-red-500 text-sm">{errors.DLN}</p>
                )}
              </div>
            </div>
            {errors.general && (
              <p className="text-red-500 text-center mt-4">{errors.general}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-center mt-4">{successMessage}</p>
            )}
            <Button type="submit" className="w-full mt-4">
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="underline">
              Log In
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
