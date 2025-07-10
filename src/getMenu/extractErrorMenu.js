import { createReadStream, writeFileSync } from "fs";
import { createInterface } from "readline";
import path from "path";

/**
 * 從 log 檔案中提取包含 [ERROR] 的店家編號
 * @param {string} filePath log 檔案的路徑
 * @returns {Promise<string[]>} 包含所有錯誤店家編號的陣列
 */
async function extractErrorIds(filePath) {
  const fileStream = createReadStream(filePath);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const errorIds = new Set(); // 使用 Set 避免重複
  const regex = /\[ERROR\]([a-z0-9]{4}) /; // 精準匹配4位英數的店家編號

  for await (const line of rl) {
    const match = line.match(regex);
    if (match && match[1]) {
      errorIds.add(match[1]);
    }
  }

  return Array.from(errorIds);
}

async function run() {
  try {
    const logFilePath = "2025-07-01.log";
    const ids = await extractErrorIds(logFilePath);

    console.log(`從 ${logFilePath} 中成功提取到 ${ids.length} 個不重複的錯誤店家編號。`);

    const outputPath = "error_shop_ids.txt";
    writeFileSync(outputPath, ids.join("\n"));
    console.log(`結果已儲存至: ${outputPath}`);
  } catch (error) {
    console.error("處理時發生錯誤:", error);
  }
}

run();