# JSON Analyzer

A browser-based JSON analysis tool for validating JSON, inspecting its structure, and exporting tabular data as CSV.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)

## Features

- Live JSON validation with automatic analysis
- Syntax error and input-size feedback
- Depth, key, node, and size metrics
- Data type summary
- Detection of duplicate keys and deeply nested structures
- Formatted JSON preview
- Table view for compatible arrays and objects
- CSV export
- Responsive split-panel interface
- Slate Blue visual theme

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
git clone <your-repository-url>
cd json_analyzer
npm install
```

### Development

```bash
npm run dev
```

Open the local URL printed by Vite.

### Production Build

```bash
npm run build
npm run preview
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## How It Works

Paste JSON into the editor. The application analyzes input automatically after a short delay or immediately when **Analyze** is selected.

The analysis panel reports:

- Maximum nesting depth
- Number of keys
- Number of nodes
- Input size in kilobytes
- Counts for strings, numbers, booleans, nulls, objects, and arrays
- Deep branch and duplicate-key warnings

JSON is accepted up to 1 MB. Traversal is capped at 100 levels to keep the browser responsive.

## Table View

Switch to **Table View** for JSON structures that can be represented as tabular records. Compatible data is displayed by row and column, with CSV export available through **Export CSV**.

## Technology

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- ESLint

## Project Structure

```text
src/
  components/
    Analysis.tsx       # Analysis/table tab container
    AnalysisPanel.tsx  # JSON metrics and formatted preview
    EditorPanel.tsx    # JSON input editor
    Navbar.tsx         # Application header
    TableView.tsx      # Tabular JSON view and CSV export
  lib/
    analyzer.ts        # JSON validation and structural analysis
    checkDuplicate.ts  # Duplicate-key detection
    jsonToCsv.ts       # CSV conversion and download
    tableCompability.ts # Table compatibility and data extraction
  App.tsx              # Application state and layout
  index.css            # Theme and global styles
  main.tsx             # React entry point
```
