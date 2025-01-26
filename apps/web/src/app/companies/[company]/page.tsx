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
    id: Number(slug)!,
  });

  console.log(data);

  const MOCK_participants = [
    {
      name: "John Doe",
      reason: "Out of topic",
      score: 5,
    },
    {
      name: "John Doe 2",
      reason: "Out of topic",
      score: 5,
    },
    {
      name: "John Doe 3",
      reason: "Out of topic",
      score: 5,
    },
    {
      name: "John Doe 4",
      reason: "Out of topic",
      score: 5,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex w-full items-center justify-between">
        <label>Tender Info</label>
        <Button variant="secondary">Analyze</Button>
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
        </div>
        <Separator orientation="vertical" className="mx-4" />
        <div>
          <span className="text-sm opacity-80">Files included: </span>
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
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
              <TableCell>{data?.trade?.[0]?.startCost} $</TableCell>
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
              <TableCell>{data?.trade?.[0]?.isLocalManufacturs}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-sm opacity-80">
                Winner Score:
              </TableCell>
              <TableCell>4</TableCell>
            </TableRow>
          </div>
        </div>
        <div>
          {/*<label>Other participants</label>
          <div className="aspect-video rounded-xl bg-muted/50 p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Diqualification Reason</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_participants.map((part) => (
                  <TableRow key={part.name}>
                    <TableCell className="font-medium">{part.name}</TableCell>
                    <TableCell>{part.reason}</TableCell>
                    <TableCell>{part.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          */}
          <label>Number of participants</label>
          <div className="aspect-video rounded-xl bg-muted/50 p-2">
            <p>{data?.trade?.[0]?.participantsCount}</p>
          </div>
        </div>
      </div>
      <label>Mermaid Chart</label>
      <div className="h-full min-h-[500px] w-full flex-1 rounded-xl bg-muted/50 p-4">
        <Mermaid chart={MERMAID_CHART_MOCK} />
      </div>
      <div className="flex w-full items-center justify-between">
        <label>AI Report</label>
        <label className="rounded-md bg-muted p-2">Sus/Not sus</label>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50" />
    </div>
  );
}
