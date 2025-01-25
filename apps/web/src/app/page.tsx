import { Separator } from "@duck/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
} from "@duck/ui/sidebar";

import { AppSidebar } from "./_components/side-bar";
import { CompanyTable } from "./_components/company-table";

export default function Page() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50 p-4">
              <h1 className="text-7xl">5</h1>
              <p className="text-[14px] opacity-80">
                suspicious companies, that require attention
              </p>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <CompanyTable />
        </div>
      </SidebarInset>
    </>
  );
}
