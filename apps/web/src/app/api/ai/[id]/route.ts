import { HumanMessage } from "@langchain/core/messages";
import axios from "axios";

import { db } from "@duck/db";

const getTenderReport = async (dealId: number) => {
  const data = await db.deal.findUnique({
    where: {
      id: dealId,
    },
    include: {
      category: true,
      customer: true,
      provider: true,
      trade: true,
    },
  });

  const provider_info = await axios.get(
    `http://localhost:8000/scrape/${data?.provider?.inn}`,
  );

  const customer_info = await axios.get(
    `http://localhost:8000/scrape/${data?.customer?.inn}`,
  );

  const message = new HumanMessage(`Give me the report about this company, here is the provider: ${provider_info.data}, and here is the customer: ${customer_info.data}`);
  console.log(message);

  return message.content.toString();
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log(Number((await params).id));
  const stuff = await getTenderReport(Number((await params).id));

  console.log(stuff);

  return stuff;
}
