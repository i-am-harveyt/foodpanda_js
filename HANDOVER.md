# Foodpanda Menu Scraper (JavaScript)

## 專案簡介

這是一個使用 JavaScript 編寫的 Foodpanda 網路爬蟲。主要功能是讀取指定的店家清單（CSV 格式），自動化爬取每間餐廳的詳細菜單資訊，並將結果儲存為 JSON 檔案以便後續分析。

## 技術棧

-   **Runtime**: [Bun.js](https://bun.sh/) (同時也兼容於 Node.js)
-   **主要語言**: JavaScript (ESM)
-   **主要套件**:
    -   `danfojs-node`: 用於讀取和處理 CSV 資料。

## 環境設定

1.  **安裝 Bun**:
    本專案建議使用 Bun 作為執行環境以獲得最佳效能。請參考 [Bun 官方網站](https://bun.sh/docs/installation) 的說明進行安裝。
    ```bash
    curl -fsSL https://bun.sh/install | bash
    ```

2.  **安裝專案依賴**:
    在專案根目錄下，執行以下指令來安裝所需的套件：
    ```bash
    bun install
    ```
    如果你偏好使用 `npm`，也可以執行 `npm install`。

## 如何執行

透過以下指令啟動爬蟲：

```bash
bun src/getMenu/main.js
```

-   程式執行後，會讀取指定的 CSV 檔案，並開始爬取流程。
-   執行過程中，會在根目錄下產生一個以當天日期命名的日誌檔案（例如 `2023-10-27.log`），記錄了詳細的執行狀況和可能的錯誤訊息。

## 專案結構

```
foodpanda_js/
├── inputCentral/         # 存放輸入資料的範例 CSV
│   ├── demo.csv
│   └── ...
├── src/
│   ├── getMenu/
│   │   ├── main.js       # 程式主要進入點
│   │   ├── getMenu.js    # 爬取單一店家菜單的核心邏輯
│   │   ├── sendReqMenu.js # 負責發送 API 請求
│   │   ├── extractData.js # 從 API 回應中提取結構化資料
│   │   ├── extractMenu.js # 專門處理菜單項目的提取
│   │   └── extractErrorMenu.js # 從日誌中提取錯誤店家 ID 的工具
│   └── lib/
│       └── Logger.js     # 簡易的日誌紀錄工具
├── package.json          # 專案設定與依賴
└── README.md             # 本文件
```

## 輸入格式

爬蟲預期讀取一個 CSV 檔案，該檔案的路徑硬編碼在 `src/getMenu/main.js` 的 `locationPath` 變數中：

```javascript
const locationPath = `../../../panda_data/shopLst/rolling.csv`;
```

請確保此路徑下的 CSV 檔案包含以下欄位：

-   `shopCode`: 店家代碼 (例如：`abmy`)
-   `shopName`: 店家名稱
-   `latitude`: 緯度
-   `longitude`: 經度

## 輸出格式

爬取的資料會儲存在 `main.js` 中 `PATH` 變數所定義的目錄：

```javascript
const PATH = `../../../panda_data_js/panda_menu/${TODAY}`;
```

輸出包含兩種檔案：

1.  **個別店家菜單**:
    -   **檔案命名**: `{latitude}_{longitude}_{shopCode}.json`
    -   **內容**: 單一店家完整的菜單原始 JSON 資料。

2.  **當日所有店家彙總**:
    -   **檔案命名**: `{YYYY-MM-DD}_all.json`
    -   **內容**: 一個 JSON 陣列，包含當天所有成功爬取到的店家菜單資料。

## 注意事項與客製化

-   **輸入與輸出路徑**:
    如上所述，輸入和輸出的檔案路徑是**硬編碼**在 `src/getMenu/main.js` 中的。如果需要修改，請直接編輯該檔案。

-   **除錯模式 (Debug Mode)**:
    在 `src/getMenu/main.js` 中有一個 `DEBUG_MODE` 的布林值開關。若設定為 `true`，程式將只爬取一個指定的測試店家，方便快速除錯。

    ```javascript
    const DEBUG_MODE = false; // 設定為 true 以啟用除錯模式
    ```

-   **錯誤處理**:
    如果某些店家爬取失敗，錯誤訊息會被記錄在日誌檔中。你可以執行 `extractErrorMenu.js` 來快速從日誌中篩選出所有失敗的店家 ID，方便重新爬取。
    ```bash
    bun src/getMenu/extractErrorMenu.js
    ``` 