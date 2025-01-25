import { Button } from "@duck/ui/button";

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex w-full items-center justify-between">
        <label>Tender Info</label>
        <Button variant="secondary">View Tender</Button>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50" />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div>
          <label>Customer Info</label>
          <div className="aspect-video rounded-xl bg-muted/50 p-4"></div>
        </div>
        <div>
          <label>Provider Info</label>
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div>
          <label>Other participants</label>
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
      </div>
      <label>Mermaid Chart</label>
      <div className="min-h-[500px] flex-1 rounded-xl bg-muted/50" />
      <div className="flex w-full items-center justify-between">
        <label>AI Report</label>
        <label className="rounded-md bg-muted p-2">Sus/Not sus</label>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50" />
    </div>
  );
}
