import { useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
  } from "../components/ui/breadcrumb";
  import { Separator } from "../components/ui/separator";
  import {
    SidebarInset,
    SidebarTrigger,
  } from "../components/ui/sidebar";
  
  // Example JSON with tablet names
  const tabletData = [
    { id: "TBL001", name: "Tablet 1" },
    { id: "TBL002", name: "Tablet 2" },
    { id: "TBL003", name: "Tablet 3" },
    { id: "TBL004", name: "Tablet 4" },
    { id: "TBL005", name: "Tablet 5" },
    { id: "TBL006", name: "Tablet 6" },
    { id: "TBL007", name: "Tablet 7" },
    { id: "TBL008", name: "Tablet 8" },
    { id: "TBL009", name: "Tablet 9" },
    { id: "TBL010", name: "Tablet 10" },
  ];
  
 export default function Tablets() {
  
    return (
      <SidebarInset className="bg-black flex w-full min-h-full">
        <header className="flex h-16 items-center gap-2 w-full">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger
              className="bg-white -ml-1 rounded-xl"
            />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList className="text-gray-700">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="text-xl text-white">
                    Tablets
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
  
        <div className="flex-1 p-4 overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tabletData.map((tablet) => (
              <div
                key={tablet.id}
                className="aspect-square rounded-xl bg-muted/50 p-4 flex items-center justify-center"
              >
                <span className="text-white text-center">{tablet.name}</span>
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    );
  }
  