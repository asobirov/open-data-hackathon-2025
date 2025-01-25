import { Separator } from "@duck/ui/separator";
import { SidebarInset, SidebarTrigger } from "@duck/ui/sidebar";
import { ThemeToggle } from "@duck/ui/theme";

import { CompanyTable } from "./_components/company-table";
import { AppSidebar } from "./_components/side-bar";

export default function Page() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-end">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <CompanyTable />
        </div>
      </SidebarInset>
    </>
  );
}
