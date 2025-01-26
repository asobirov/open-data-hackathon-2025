"use client";

import { usePathname } from "next/navigation";

import { Button } from "@duck/ui/button";
import { Separator } from "@duck/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@duck/ui/table";

import { Mermaid } from "@/app/_components/mermaid";
import { MERMAID_CHART_MOCK } from "@/app/mocks/mermaid-chart-mock";
import { api } from "@/trpc/react";

export default function Page() {
  const pathname = usePathname();
  const slug = pathname.split("/")[2];

  const { data } = api.deal.byId.useQuery({
    id: Number(slug),
  });

  const onAiAnalyze = () => {};

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex w-full items-center justify-between">
        <label>Tender Info</label>
      </div>
      <div className="flex min-h-[200px] w-full flex-1 rounded-xl bg-muted/50 p-2">
        <div className="gap-4">
          <TableRow className="text-start">
            <TableCell className="text-sm opacity-80">Lot number:</TableCell>
            <TableCell>{slug}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-sm opacity-80">Category:</TableCell>
            <TableCell>{data?.category?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-sm opacity-80">Deal amount:</TableCell>
            <TableCell>{data?.cost} $</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-sm opacity-80">
              Delivery Status:
            </TableCell>
            <TableCell>{data?.statusName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-sm opacity-80">
              Participants amount:
            </TableCell>
            <TableCell>{data?.trade[0]?.participantsCount}</TableCell>
          </TableRow>
        </div>
        <Separator orientation="vertical" className="mx-4" />
        {/* <div>
          <span className="text-sm opacity-80">Files included: </span>
        </div> */}
      </div>
      <div className="grid auto-rows-min grid-cols-2 gap-4">
        <div>
          <label>Customer Info</label>
          <div className="aspect-video gap-8 rounded-xl bg-muted/50 p-4">
            <TableRow className="text-start">
              <TableCell className="text-sm opacity-80">
                Company Name:
              </TableCell>
              <TableCell>{data?.customer?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">INN:</TableCell>
              <TableCell>{data?.customer?.inn}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">
                Initial amount:
              </TableCell>
              <TableCell>{data?.trade[0]?.startCost}$</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">Deal Amount:</TableCell>
              <TableCell>{data?.cost}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">Score:</TableCell>
              <TableCell>{data?.statusName}</TableCell>
            </TableRow>
          </div>
        </div>
        <div>
          <label>Provider Info</label>
          <div className="aspect-video gap-8 rounded-xl bg-muted/50 p-4">
            <TableRow className="text-start">
              <TableCell className="text-sm opacity-80">
                Company Name:
              </TableCell>
              <TableCell>{data?.provider?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">
                Market Items:
              </TableCell>
              <TableCell>{data?.category?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">Director:</TableCell>
              <TableCell>{data?.provider?.name} $</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">Constitutor:</TableCell>
              <TableCell>Null</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">
                Уставной фонд:
              </TableCell>
              <TableCell>Null</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">
                Part of Uzbekistan:
              </TableCell>
              <TableCell>{data?.trade[0]?.isLocalManufacturs}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">
                Winner Score:
              </TableCell>
              <TableCell>4</TableCell>
            </TableRow>
          </div>
        </div>
      </div>
      <label>Mermaid Chart</label>
      <div className="h-full min-h-[500px] w-full flex-1 rounded-xl bg-muted/50 p-4">
        <Mermaid chart={MERMAID_CHART_MOCK} />
      </div>
      <div className="flex w-full items-center justify-between">
        <label>AI Report</label>
        <Button variant="secondary">Analyze</Button>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50" />
    </div>
  );
}
