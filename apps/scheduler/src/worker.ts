import path, { dirname } from "path";
import { fileURLToPath } from "url";
import type { TaskList } from "graphile-worker";

import { taskList } from "@/tasks/_tasks-list";
import { startWorker, startWorkerUtils } from "@/utils";

try {
  await startWorkerUtils();

  const runner = await startWorker({
    concurrency: 3,
    noHandleSignals: false,
    pollInterval: 1000,

    crontabFile: path.join(dirname(fileURLToPath(import.meta.url)), "crontab"),

    taskList: taskList as unknown as TaskList,
  });
  await runner.promise;
} catch (e) {
  console.error(e);
  process.exit(1);
}
