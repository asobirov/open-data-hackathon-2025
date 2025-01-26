import { z } from "zod";

import { db } from "@duck/db";

import { addJob, createTask } from "@/utils";

export const StartReportGenerationSchema = z.object({});

export const startReportGeneration = createTask({
  name: "start-report-generation-task",
  schema: StartReportGenerationSchema,
  task: async () => {
    console.log("Generating report...");

    const trades = await db.trade.findMany({
      where: {
        deal: {
          report: null,
        },
      },
      orderBy: {
        deal: {
          date: "desc",
        },
      },
      take: 3,
    });

    if (trades.length === 0) {
      console.warn("No trades to generate report for");
      return;
    }

    // GENERATE REPORT

    for (const trade of trades) {
      await addJob({
        name: "generate-report-task",
        payload: {
          tradeId: trade.id,
        },
      });
    }
  },
});
