<div align="center">
  <img width="1200" height="475" alt="OrgView Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  <h1>🏢 OrgView</h1>
  <p><strong>Recursive Corporate Mapping & Director Intelligence for New Zealand</strong></p>
</div>

---

## 🌟 Overview

**OrgView** is a powerful visual workspace designed for investigators, researchers, and corporate analysts. It leverages the New Zealand Business Number (NZBN) and Companies Office APIs to transform complex corporate data into intuitive, interactive maps.

Whether you're tracing ultimate holding companies or vetting an individual's corporate history, OrgView provides the clarity you need to navigate the New Zealand business landscape.

## 🚀 Key Features

### 1. Dual-Mode Search
*   **Company Search**: Enter a name or NZBN to generate a "Butterfly Map" of the corporate web. It recursively crawls upwards to find ultimate parents and downwards to identify subsidiaries and siblings.
*   **Person Search**: Search for any individual to find every directorship and shareholding they hold across the New Zealand register. Results are presented in a high-density, filterable list.

### 2. Interactive Visualization
*   **Dynamic Butterfly Maps**: Built with ReactFlow, our maps show ownership percentages and relationship types at a glance.
*   **Smart Visibility**: Manage cluttered graphs using our Expand/Collapse system. See hidden descendant counts on badges and drill down only when needed.
*   **Tidy Up (AI Layout)**: One-click optimization to rearrange your graph into a compact, professional pyramid shape.
*   **Context Control**: Right-click any node to Recenter the graph, View Directors, or Hide Parents for focused analysis.

### 3. Integrated Risk Intelligence
*   **Disqualified Directors Alert**: Automatic, high-visibility cross-referencing against the Disqualified Directors register. If a person search matches a disqualified individual, a red alert provides full details of the disqualification reason and period.
*   **Insolvency & Bankruptcy Tracking**: Integrated checks against the Insolvency Register to flag bankruptcy records or historical insolvency events.
*   **Entity Status Filtering**: Toggle between viewing only active entities or including removed/liquidated companies with built-in safety warnings for large datasets.

### 4. QoL & Investigative Tools
*   **Snapshots**: Save your progress locally. Snapshots capture the entire graph or search state, allowing you to resume your investigation later.
*   **Export/Import**: Download your snapshots as JSON files to share with colleagues or move between devices.
*   **Pro Exports**: Export high-resolution PNGs for reports or generate a print-ready PDF view of any corporate map.
*   **Dark Mode**: A sleek, high-contrast dark theme optimized for long research sessions.
*   **Time Travel (Beta)**: Filter and view data based on specific historical dates.

---

## 🔐 Security & Privacy

*   **Bring Your Own Key (BYOK)**: OrgView requires your own NZBN and Companies Office API keys.
*   **Local Storage**: All API keys and snapshots are stored **exclusively in your browser's local storage**. No data is ever sent to our servers.
*   **Direct API Connection**: The app communicates directly from your browser to the government APIs.

---

## 🛠️ Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   [NZBN API Discovery Keys](https://api.business.govt.nz/)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/joshwong197/NZcompanyview.git
    cd NZcompanyview
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run locally**:
    ```bash
    npm run dev
    ```

### Configuration
Once the app is running:
1.  Click the **Settings (Gear Icon)** in the top bar.
2.  Paste your **NZBN API Key** and **Companies API Key**.
3.  (Optional) Add your **Disqualified Directors** and **Insolvency** keys for full risk intelligence.
4.  Switch between **Sandbox** and **Production** environments as needed.

---

## 👨‍💻 Built With
*   **React 19** & **TypeScript**
*   **ReactFlow** (Graph Visualization)
*   **Vite** (Build Tool)
*   **Lucide React** (Iconography)
*   **TailwindCSS** (Premium UI/UX)

---

<div align="center">
  <p>Built for the modern New Zealand corporate investigator.</p>
</div>
