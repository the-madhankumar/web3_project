import React from "react";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { LifeBuoy, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function NavSecondary({ items, ...props }) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>

          <Dialog>
            <DialogTrigger asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm">
                  <div>
                    <LifeBuoy /> 
                    <span>Support</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Support</DialogTitle>
                <DialogDescription>
                  We're here to help. Reach out to our support team anytime.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <p className=" text-sm">If you need assistance, please contact us at:</p>
                  <p className="text-black text-md font-semibold">
                    Email: <a href="mailto:medisure@gmail.com" className="text-blue-500 hover:underline">medisure@gmail.com</a>
                  </p>
                  <p className="text-black text-md font-semibold">
                    Phone: <a href="tel:+1234567890" className="text-blue-500 hover:underline">+1 (234) 567-890</a>
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <h3 className="text-black font-semibold">Support Guidelines</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Provide detailed information about your issue.</li>
                    <li>Attach screenshots or error messages, if applicable.</li>
                    <li>Our team responds within 24-48 hours.</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="sm">
                    <div>
                      <Send />
                      <span>Feedback</span>
                    </div>
                      
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Send Feedback</DialogTitle>
                  <DialogDescription>
                    Send your feedback to our team
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="name"
                      defaultValue="@gmail.com"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="Feedback" className="text-right">
                      Feeback
                    </Label>
                    <Textarea 
                      placeholder = "Write your feedback here"
                      id="Feedback"
                      defaultValue=""
                      className="max-h-40 h-24 col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
