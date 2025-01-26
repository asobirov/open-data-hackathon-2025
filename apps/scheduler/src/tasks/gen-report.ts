import { generateText } from "ai";
import { z } from "zod";

import { db } from "@duck/db";

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

    const report = null;

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
