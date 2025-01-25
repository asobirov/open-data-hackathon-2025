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

const getCurrencyMap = (curr: CurrencyName) => {
  const codesMap: Record<CurrencyName, string> = {
    Доллар: "USD",
    Евро: "EUR",
    Рубль: "RUB",
    Сум: "UZS",
  };

  return {
    name: curr,
    code: codesMap[curr] ?? curr,
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

const getOrCreateCompany = async ({
  inn,
  name,
  type,
}: {
  inn: string | number | null;
  name: string;
  type: CompanyType | null;
}) => {
  return await db.$transaction(async (tx) => {
    const company = await tx.company.findFirst({
      where: {
        OR: [
          {
            inn: inn ? `${inn}` : null,
          },
          {
            name: name,
          },
        ],
      },
    });

    if (company) {
      return company;
    }

    return await tx.company.create({
      data: {
        name: name,
        type: type,
        inn: inn ? `${inn}` : null,
      },
    });
  });
};

const getCategory = async (name: string) => {
  return await db.$transaction(async (tx) => {
    const category = await tx.category.findFirst({
      where: {
        name: name,
      },
    });

    if (category) {
      return category;
    }

    return await tx.category.create({
      data: {
        name: name,
      },
    });
  });
};

const getCurrency = async (curr: CurrencyName) => {
  return await db.$transaction(async (tx) => {
    const { code, name } = getCurrencyMap(curr);
    const currency = await tx.currency.findFirst({
      where: {
        code: code,
      },
    });

    if (currency) {
      return currency;
    }

    return await tx.currency.create({
      data: {
        code: code,
        name: name,
      },
    });
  });
};

const processItem = async (item: RawData) => {
  const findTrade = await db.trade.findFirst({
    where: {
      id: item.trade_id,
    },
  });

  if (findTrade) {
    console.log("Item already exists", item.trade_id);
    return true
  }
  try {
    const customer = await getOrCreateCompany({
      inn: item.customer_inn,
      name: item.customer_name,
      type: getCompanyType(item.customer_type_name),
    });

    const provider = await getOrCreateCompany({
      inn: item.provider_inn,
      name: item.provider_name,
      type: null,
    });

    const category = await getCategory(item.category_name);
    const currency = await getCurrency(item.currency_name);

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
                connect: {
                  id: category.id,
                },
              },

              contractStatusName: item.deal_contract_status_name,

              contractKaznaStatusId: item.deal_contract_kazna_status_id,
              contractKaznaStatusName: item.deal_contract_kazna_status_name,

              date: parseDate(item.deal_date),

              customer: {
                connect: {
                  id: customer.id,
                },
              },
              provider: {
                connect: {
                  id: provider.id,
                },
              },
            },
          },
        },
        isLocalManufacturs: item.is_local_manufacturs,
        participantsCount: item.participants_count,
        proposalStatus: getProposalStatus(item.proposal_status_name),
        startCost: item.start_cost,
        currency: {
          connect: {
            id: currency.id,
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

    return true;
  } catch (e) {
    // Cringe activity, but i gotta debug idk
    console.log(
      `Error on item ${item.trade_id}, ${item.customer_inn}, ${item.provider_inn}`,
    );
    throw e;
  }

  console.log("Item processed", item.trade_id);
};

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function printETA(
  processedCount: number,
  totalCount: number,
  startTime: number,
) {
  const elapsedMs = Date.now() - startTime;
  const avgMs = elapsedMs / processedCount;
  const remaining = totalCount - processedCount;
  const etaMs = avgMs * remaining;
  const etaSec = (etaMs / 1000).toFixed(1);
  console.log(`  ETA: ~${etaSec}s`);
}

const UPLOADED_IDS_FILE = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "uploadedIds.json",
);

async function loadUploadedIds(): Promise<Set<number>> {
  try {
    const raw = await fs.readFile(UPLOADED_IDS_FILE, "utf-8");
    const arr = JSON.parse(raw) as number[];
    return new Set(arr);
  } catch {
    console.log("No local ID cache found, starting fresh.");
    return new Set();
  }
}

async function saveUploadedIds(set: Set<number>): Promise<void> {
  const arr = Array.from(set);
  await fs.writeFile(UPLOADED_IDS_FILE, JSON.stringify(arr, null, 2), "utf-8");
}

const dirname = path.dirname(new URL(import.meta.url).pathname);
const rawJson = await fs.readFile(
  path.join(dirname, "./new_data.json"),
  "utf-8",
);
const data = JSON.parse(rawJson) as RawData[];

const totalItems = data.length;
console.log(`Found ${totalItems} items in JSON.`);
const startTime = Date.now();

// Split into chunks of 10 (adjust to your preference)
const chunkSize = 10;
const chunks = chunkArray(data, chunkSize);

let processedCount = 0;

const uploadedIds = await loadUploadedIds();

for (let c = 0; c < chunks.length; c++) {
  const chunk = chunks[c];

  if (!chunk) {
    continue;
  }

  // For each item in chunk, skip if in local set
  const tasks = chunk.map(async (item) => {
    if (uploadedIds.has(item.trade_id)) {
      console.log(`Skipped trade ${item.trade_id} (in local cache).`);
      return;
    }
    try {
      const success = await processItem(item);
      if (success === true) {
        uploadedIds.add(item.trade_id);
      }
      processedCount++;
    } catch (err) {
      console.error(`Error on trade ${item.trade_id}:`, err);
    }
  });

  await Promise.all(tasks);

  // 4) Save local ID cache after each chunk
  await saveUploadedIds(uploadedIds);

  console.log(
    `Chunk ${c + 1}/${chunks.length} done (${processedCount} total).`,
  );

  if (processedCount < totalItems) {
    printETA(processedCount, totalItems, startTime);
  }
}

console.log("All items processed.");
