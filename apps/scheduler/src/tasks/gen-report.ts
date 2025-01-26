import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { z } from "zod";

import { db } from "@duck/db";

import { env } from "@/env";
import { createTask } from "@/utils";

export const GenerateReportSchema = z.object({
  tradeId: z.number().optional(),
});

export const generateReportTask = createTask({
  name: "generate-report-task",
  schema: GenerateReportSchema,
  task: async ({ tradeId }) => {
    console.log(`Generating report for trade ${tradeId}`);

    const trade = await db.trade.findFirst({
      where: {
        id: tradeId,
      },
      include: {
        deal: true,
        currency: true,
        files: true,
      },
    });

    if (!trade) {
      console.error("Trade not found");
      return;
    }

    // GENERATE REPORT

    const res = await fetch(`http://localhost:3000/api/ai/${trade.dealId}`);

    if (!res.ok) {
      console.error("Failed to generate report");
      return;
    }

    const report = await res.text();

    await db.trade.update({
      where: {
        id: tradeId,
      },
      data: {
        deal: {
          update: {
            report: report,
          },
        },
      },
    });
  },
});
