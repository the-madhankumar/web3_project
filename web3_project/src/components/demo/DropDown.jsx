"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";

function DropDown() {
  const [position, setPosition] = React.useState("bottom");
  const navigate = useNavigate();
  const handleSignupRedirect = (role) => {
    if (role === "Doctor") {
      navigate("/signupd");
    } else if (role === "Patient") {
      navigate("/signupp");
    }else {
      navigate("/signupphar");
    }
};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Sign Up</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-black w-56 bg-white/100 rounded-xl">
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition} defaultValue="Doctor">
          <DropdownMenuRadioItem  onClick={() => handleSignupRedirect("Doctor")} value="Doctor">Doctor</DropdownMenuRadioItem>
          <DropdownMenuRadioItem  onClick={() => handleSignupRedirect("Patient")} value="Patient">Patient</DropdownMenuRadioItem>
          <DropdownMenuRadioItem  onClick={() => handleSignupRedirect("pharmist")} value="Patient">Pharmist</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropDown;