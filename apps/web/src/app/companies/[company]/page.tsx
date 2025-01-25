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

export default function Page() {
  const pathname = usePathname();
  const slug = pathname.split("/")[2];

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
        <div className="flex w-[300px] gap-4">
          <div className="flex flex-col">
            <p className="pt-[7px] text-sm opacity-80">Lot number: </p>
            <p className="pt-[7px] text-sm opacity-80">Category: </p>
            <p className="pt-[7px] text-sm opacity-80">Deal amount: </p>
            <p className="pt-[7px] text-sm opacity-80">Delivery Status: </p>
          </div>
          <div>
            <a
              className="ml-2 text-xl font-bold underline"
              href={`https://etender.uzex.uz/lot/${slug}`}
            >
              {slug}
            </a>
            <p className="ml-2 text-xl">Category</p>
            <p className="ml-2 text-xl">3 000 000 $</p>
            <p className="ml-2 text-xl">Not delivered</p>
          </div>
        </div>
        <Separator orientation="vertical" className="mx-4" />
        <div>
          <span className="text-sm opacity-80">Files included: </span>
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div>
          <label>Customer Info</label>
          <div className="flex aspect-video gap-8 rounded-xl bg-muted/50 p-4">
            <div className="flex flex-col">
              <p className="pt-[7px] text-sm opacity-80">Company Name: </p>
              <p className="pt-[7px] text-sm opacity-80">
                Responsible Person:{" "}
              </p>
              <p className="pt-[7px] text-sm opacity-80">Initial amount: </p>
              <p className="pt-[7px] text-sm opacity-80">Deal Amount: </p>
              <p className="pt-[7px] text-sm opacity-80">
                Minimum required score:{" "}
              </p>
            </div>
            <div>
              <p className="ml-2 text-xl">Name</p>
              <p className="ml-2 text-xl">Shavkat</p>
              <p className="ml-2 text-xl">2 000 000 $</p>
              <p className="ml-2 text-xl">2 500 000 $</p>
              <p className="ml-2 text-xl">3/5</p>
            </div>
          </div>
        </div>
        <div>
          <label>Provider Info</label>
          <div className="flex aspect-video gap-8 rounded-xl bg-muted/50 p-4">
            <div className="flex flex-col">
              <p className="pt-[7px] text-sm opacity-80">Company Name: </p>
              <p className="pt-[7px] text-sm opacity-80">Market Items:</p>
              <p className="pt-[7px] text-sm opacity-80">Director: </p>
              <p className="pt-[7px] text-sm opacity-80">Constitutor: </p>
              <p className="pt-[7px] text-sm opacity-80">Уставной фонд:</p>
              <p className="pt-[7px] text-sm opacity-80">Credibility Score:</p>
              <p className="pt-[7px] text-sm opacity-80">Winner Score:</p>
            </div>
            <div>
              <p className="ml-2 text-xl">Company Name</p>
              <p className="ml-2 text-xl">Deasel engines</p>
              <p className="ml-2 text-xl">Shavkat</p>
              <p className="ml-2 text-xl">Andrey</p>
              <p className="ml-2 text-xl">2 000 000 $</p>
              <p className="ml-2 text-xl">3/5</p>
              <p className="ml-2 text-xl">3/5</p>
            </div>
          </div>
        </div>
        <div>
          <label>Other participants</label>
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
        </div>
      </div>
      <label>Mermaid Chart</label>
      <div className="min-h-[500px] h-full w-full flex-1 rounded-xl bg-muted/50 p-4">
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
