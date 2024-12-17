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
  import Tablepat from "@/components/demo/Tablepat";
  
  function Dashboardpat({email}) {
    return (
      <SidebarInset className="bg-black w-full h-full min-h-full">
        <header className="w-full flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="bg-white -ml-1 rounded-xl" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList className="text-gray-700">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="text-xl text-white">
                    DashBoard
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex justify-center items-center text-white text-2xl">
          <h1>PRESCRIPTION QR</h1>
        </div>
        <div className="w-full p-6">
          <Tablepat email={email} />
        </div>
      </SidebarInset>
    );
  }
  
  export default Dashboardpat;
  