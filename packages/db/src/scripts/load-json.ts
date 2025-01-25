import { promises as fs } from "fs";
import path from "path";
import { date } from "zod";

import type { File } from "@duck/db";
import { CompanyType, db, ProposalStatus } from "@duck/db";

import type { CurrencyName, RawData } from "@/scripts/types";
import { CustomerTypeName, ProposalStatusName } from "@/scripts/types";

const getCompanyType = (type: CustomerTypeName): CompanyType => {
  if (type === CustomerTypeName.BudgetBuyurtmachi) {
    return CompanyType.Budget;
  }

  return CompanyType.Corporate;
};

const getProposalStatus = (type: ProposalStatusName): ProposalStatus => {
  if (type === ProposalStatusName.УдаленСоСтороныЗаказчика) {
    return ProposalStatus.Deleted;
  }

  return ProposalStatus.Initiated;
};

const getCurrency = (curr: CurrencyName) => {
  const codesMap: Record<CurrencyName, string> = {
    Доллар: "USD",
    Евро: "EUR",
    Рубль: "RUB",
    Сум: "UZS",
  };

  return {
    name: curr,
    code: codesMap[curr],
  };
};

const parseDate = (date: string | Date | null): Date | null => {
  if (!date) {
    return null;
  }

  if (date instanceof Date) {
    return date;
  }

  const dottedDateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

  if (dottedDateRegex.test(date)) {
    // Parse as DD.MM.YYYY
    const [dayStr, monthStr, yearStr] = date.split(".");
    if (!dayStr || !monthStr || !yearStr) {
      throw new Error(`Invalid dotted date format: ${date}`);
    }

    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1; // zero-based in JS
    const year = parseInt(yearStr, 10);

    const dateObj = new Date(year, month, day);
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid dotted date format: ${date}`);
    }
    return dateObj;
  } else {
    // Fallback: parse with new Date()
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date string: ${date}`);
    }
    return dateObj;
  }
};

const getFiles = (item: RawData): Omit<File, "id" | "tradeId">[] => {
  // FIXME: use proper prisma types for file create or smth
  const files: Omit<File, "id" | "tradeId">[] = [];

  files.push({
    type: "additional_protocol",

    fileDate: parseDate(item.additional_protocol_file_date),
    fileExt: item.additional_protocol_file_ext,
    fileName: item.additional_protocol_file_name,
    filePath: item.additional_protocol_file_path,
    fileSizes: item.additional_protocol_file_sizes,
  });

  files.push({
    type: "contract",

    fileDate: parseDate(item.contract_file_date),
    fileExt: item.contract_file_ext,
    fileName: item.contract_file_name,
    filePath: item.contract_file_path,
    fileSizes: item.contract_file_sizes,
  });

  // filter if all fields but type are null
  return files.filter((file) =>
    Object.entries(file).some(
      ([key, value]) => key !== "type" && value !== null,
    ),
  );
};

const outputETA = (processedCount: number, remainCount: number) => {
  const elapsedMs = Date.now() - startTime;
  const avgMs = elapsedMs / processedCount;
  const etaMs = avgMs * remainCount;
  const etaSec = (etaMs / 1000).toFixed(1);

  console.log(`  ETA: ~${etaSec}s\n`);
};

const dirname = path.dirname(new URL(import.meta.url).pathname);
const rawJson = await fs.readFile(
  path.join(dirname, "./new_data.json"),
  "utf-8",
);
const data = JSON.parse(rawJson) as RawData[];

const totalItems = data.length;
console.log(`Found ${totalItems} items in JSON.`);
const startTime = Date.now();

for (let i = 0; i < totalItems; i++) {
  const item = data[i];

  const processedCount = i + 1;
  const remainCount = data.length - processedCount;

  if (!item) {
    console.log(`[${i + 1}/${totalItems}] Skipping empty item`);
    continue;
  }

  console.log(`[${i + 1}/${totalItems}] Processing item ${item.trade_id}`);

  const currency = getCurrency(item.currency_name);

  const findTrade = await db.trade.findFirst({
    where: {
      id: item.trade_id,
    },
  });

  if (findTrade) {
    console.log("Item already exists", item.trade_id);
    outputETA(processedCount, remainCount);
    continue;
  }

  await db.trade.create({
    data: {
      id: item.trade_id,
      displayNo: item.display_no ? `${item.display_no}` : null,
      deal: {
        connectOrCreate: {
          where: {
            id: item.deal_id,
          },
          create: {
            id: item.deal_id,

            cost: item.deal_cost,
            statusName: item.deal_status_name,
            contractDate: parseDate(item.deal_contract_date),

            category: {
              connectOrCreate: {
                where: {
                  name: item.category_name,
                },
                create: {
                  name: item.category_name,
                },
              },
            },

            contractStatusName: item.deal_contract_status_name,

            contractKaznaStatusId: item.deal_contract_kazna_status_id,
            contractKaznaStatusName: item.deal_contract_kazna_status_name,

            date: parseDate(item.deal_date),

            customer: {
              connectOrCreate: {
                where: {
                  inn: item.customer_inn ? `${item.customer_inn}` : undefined,
                },
                create: {
                  name: item.customer_name,
                  type: getCompanyType(item.customer_type_name),
                  inn: item.customer_inn ? `${item.customer_inn}` : null,
                },
              },
            },
            provider: item.provider_inn
              ? {
                  connectOrCreate: {
                    where: {
                      inn: item.provider_inn
                        ? `${item.provider_inn}`
                        : undefined,
                    },
                    create: {
                      name: item.provider_name,
                      inn: item.provider_inn ? `${item.provider_inn}` : null,
                    },
                  },
                }
              : undefined,
          },
        },
      },
      isLocalManufacturs: item.is_local_manufacturs,
      participantsCount: item.participants_count,
      proposalStatus: getProposalStatus(item.proposal_status_name),
      startCost: item.start_cost,
      currency: {
        connectOrCreate: {
          where: {
            code: currency.code,
          },
          create: {
            code: currency.code,
            name: currency.name,
          },
        },
      },
      files: {
        createMany: {
          data: getFiles(item),
        },
      },
      rn: item.rn,
      unsortedData: {
        founder: item.founder,
        total_count: item.total_count,
        can_comment: item.can_comment,
      },
    },
  });

  outputETA(processedCount, remainCount);

  console.log("Item processed", item.trade_id);
}
