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
import Prescrip from "@/components/demo/Prescrip";
import LineCharpres from "@/components/demo/LineChart";

function Prescription({name}) {
  return (
    <SidebarInset className="bg-black">
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="bg-white -ml-1 rounded-xl" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList className="text-gray-700">
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink className="text-xl text-white">
                Prescription
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div className="">
        <div className="rounded-xl md:col-span-2 flex justify-center ">
          <Prescrip name={name}/>
        </div>
      </div>

      {/* <div className="min-h-[10vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" >
        <LineCharpres />
      </div> */}
    </div>
  </SidebarInset>
  );
}

export default Prescription;
