<p align="center">
  <h1>👁️ Mitsuketa</h1>
  <strong>見つけた — "I found it."</strong><br/>
  <em>A visual corporate investigation tool for New Zealand entities.</em>
</p>

---

## Overview

**Mitsuketa** is a powerful visual workspace designed for investigators, researchers, and corporate analysts. It leverages the New Zealand Business Number (NZBN), Companies Office, Insolvency Register, and Disqualified Directors APIs to transform complex corporate data into intuitive, interactive maps.

Mitsuketa is built by someone with credit management, debt recovery, insolvency & legal experience, and therefore picks up on all the exact points 1 would need to look for in those contexts. Think of it as an aggregator of all the most important parts of the available public registers.

---

## ✨ Features

### 🏢 Company Search & Structure Mapping
Search for any NZ-registered company by name or NZBN. Mitsuketa recursively crawls the shareholding data to build a full **interactive graph** showing:
- **Upstream**: Parent companies and ultimate holding entities
- **Downstream**: Subsidiaries, child companies, and their structures
- **Sibling entities**: Companies that share the same parent

Each node on the graph is colour-coded by status (Active, Removed, In Receivership, etc.) and displays key details at a glance.

### 👤 Individual (Person) Search
Switch to **Person Mode** to search for an individual by name. Mitsuketa queries the Companies Office Roles API to find every company a person is associated with as a:
- **Director**
- **Shareholder**

Results are displayed in a detailed table showing company name, NZBN, role type, shareholding percentage, and company status.

### ⚠️ Risk Intelligence
Mitsuketa automatically enriches results with real-time risk indicators:
- 🔴 **External Administration**: Companies in Receivership, Liquidation, or Voluntary Administration
- ⚫ **Removed Companies**: Companies that have been struck off the register AND companies that are about to removed from the register.
- 🚫 **Disqualified Directors**: Cross-references the Disqualified Directors register to flag individuals banned from holding directorships
- 📋 **Insolvency Register**: Checks the Insolvency Register for personal insolvency records associated with searched individuals
- ⚡ **Historic Insolvency**: Detects past insolvency events even for removed companies

### 🗺️ Interactive Graph
Built on **React Flow**, the graph supports:
- **Pan & Zoom**: Navigate large corporate structures
- **Right-Click Context Menu**: Expand a node's full structure, view directors, or open the entity on the Companies Register
- **Collapse/Expand**: Hide or reveal branches to focus on specific parts of the structure
- **Tidy Up**: One-click layout optimisation that groups sibling nodes and centers parents
- **Undo Tidy Up**: Revert to the previous layout if the optimisation doesn't suit your needs

### 📸 Snapshots
Save the current state of your graph as a **Snapshot**:
- **Save**: Capture nodes, edges, and search context
- **Restore**: Load any previous snapshot to resume your investigation
- **Export All**: Download all snapshots as a single `.json` file for backup or sharing
- **Import**: Load snapshots from a `.json` file

### 📤 Export
Export your work in multiple formats:
- **PNG**: High-resolution image of the graph or person search results
- **PDF**: Print-ready PDF export
- **JSON**: Full snapshot data for programmatic use

### 🌗 Dark Mode
Toggle between Light and Dark themes. Your preference is saved locally and persists across sessions.

---

## 🔐 API Keys & Security

### Secure Proxy Architecture
Mitsuketa uses a **Serverless Function** as a secure proxy for all API requests. This means:
- **No API keys are ever exposed** in the browser or client-side code
- All requests are routed through `/api/proxy` on the server
- The proxy supports **Bring Your Own Key (BYOK)**: if a user provides their own key, it takes priority
- If no user key is provided, the app falls back to organisation-level keys stored securely as Vercel environment variables

### Rate Limiting
The proxy includes a **soft rate limit of 200 requests per minute per IP address** to protect the underlying Government API keys from abuse.

### Required API Keys
We have enabled the Serverless Function (environment variables) for all users to use Mitsuketa. However if you wish to BYOK, you need keys from:

| Key | API | How to Get |
|-----|-----|-----------|
| NZBN Key | [NZBN API](https://api.business.govt.nz/) | Register at api.business.govt.nz |
| Companies Key | [Companies Office Roles API](https://api.business.govt.nz/) | Same portal, subscribe to Companies Office APIs |
| Disqualified Directors Key | [Disqualified Directors API](https://api.business.govt.nz/) | Same portal |
| Insolvency Key | [Insolvency Register API](https://api.business.govt.nz/) | Same portal |

> **All keys are free** to obtain from the NZ Government API portal.

---

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **React Flow** | Interactive graph visualisation |
| **Dagre** | Automatic graph layout |
| **Lucide React** | Icons |
| **Tailwind CSS** | Styling |
| **Vercel Serverless Functions** | Secure API proxy |
| **html-to-image** | PNG/PDF export |

---

## 📁 Project Structure

```
├── api/
│   └── proxy.ts              # Vercel Serverless Function (secure API proxy + rate limiting)
├── components/
│   ├── ConfigBar.tsx          # Top bar with logo, settings, and theme toggle
│   ├── CustomNodes.tsx        # Company, Person, and Summary graph nodes
│   ├── NodeContextMenu.tsx    # Right-click menu for graph nodes
│   ├── PersonSearchResults.tsx # Table view for person search results
│   └── ...                    # Other UI components
├── services/
│   ├── apiService.ts          # Core API service (graph building, entity fetching)
│   ├── directorSearchService.ts # Person name search service
│   ├── directorService.ts     # Director extraction from entity roles
│   ├── layoutService.ts       # Graph layout engine
│   └── layoutOptimizer.ts     # Layout tidying algorithm
├── src/
│   └── api/
│       ├── companyStatusApi.ts      # Company status enrichment
│       ├── disqualifiedDirectorsApi.ts # Disqualified directors check
│       └── insolvencyApi.ts         # Insolvency register check
├── App.tsx                    # Main application component
├── types.ts                   # TypeScript type definitions
├── index.html                 # Entry HTML
└── vite.config.ts             # Vite configuration
```

---

## 📜 License

This project is for personal and educational use. All data is sourced from publicly available New Zealand Government APIs.

---

<p align="center">
  <strong>Mitsuketa</strong> — 見つけた<br/>
  <em>Built in New Zealand, shout out to the LegalQuants</em>
</p>
