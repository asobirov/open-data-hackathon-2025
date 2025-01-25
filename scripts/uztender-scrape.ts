import Bun from "bun";

let res = "ok";

for (let i = 2304; res === "ok"; i++) {
  const data = await fetch("https://apietender.uzex.uz/api/common/DealsList", {
    headers: {
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/json; charset=UTF-8",
      language: "ru",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
    },
    referrer: "https://etender.uzex.uz/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `{"From":${50 * i + 1},"To":${
      50 * (i + 1) + 1
    },"currencyId":null,"System_Id":0,"StatusId":"5"}`,
    method: "POST",
    mode: "cors",
    credentials: "omit",
  });

  console.log("From:", 50 * i + 1, "; To:", 50 * (i + 1));

  console.log("Status:", data.status);

  res = data.status === 200 ? "ok" : "error";

  const jsonData = (await data.json()) as [];

  console.log("Length:", jsonData.length);

  // Read existing data
  let existingData = [];
  try {
    existingData = await Bun.file("./data.json").json();
  } catch (error) {
    console.log("No existing file or invalid JSON, starting fresh.");
  }

  // Append new data
  existingData.push(...jsonData); // Assuming jsonData is an array

  // Write back to the file
  await Bun.write("./data.json", JSON.stringify(existingData, null, 2));
}

console.log("finished");
