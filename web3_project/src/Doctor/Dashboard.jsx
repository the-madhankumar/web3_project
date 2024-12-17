import Chart from "@/components/demo/BarChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "../components/ui/breadcrumb"
import { Separator } from "../components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,   
} from "../components/ui/sidebar"
import { Pchart } from "@/components/demo/PieChart";
import Comparechart from "@/components/demo/Comparechart";
import Extrachart from "@/components/demo/Extrachart";

function Dashboard() {

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
                    DashBoard
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 md:grid-rows-1">
            <div className="h-[200px] rounded-xl bg-muted/50 md:col-span-1 flex flex-col gap-4">
              <Pchart />
              <Extrachart />
            </div>
            <div className="rounded-xl bg-muted/50 md:col-span-2">
              <Comparechart />
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Chart />
          </div>
        </div>



      </SidebarInset>
  )
}

export default Dashboard;