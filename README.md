# Auto Lab Record Generator

A complete MVP web application that generates lab records for engineering students using AI (Groq API).

## Features

- **AI-Powered Generation**: Uses Groq API (llama3-70b-8192) to generate complete lab records
- **Complete Lab Records**: Includes Aim, Theory, Algorithm, Code, Output, Learning Outcomes, and Viva Questions
- **Editable Sections**: All generated content can be edited inline
- **DOCX Export**: Download formatted Word documents
- **Clean UI**: Student-friendly interface with Tailwind CSS
- **Error Handling**: Robust error handling at every layer

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Groq API (OpenAI-compatible format)
- **Document Generation**: `docx` npm package

## Prerequisites

- Node.js 18+ installed
- Groq API key (get from https://console.groq.com)

## Setup Instructions

1. **Clone or navigate to the project directory**:
   ```bash
   cd "d:\My Projects\LabFile"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Open `.env.local` file
   - Replace `your_groq_api_key_here` with your actual Groq API key:
   ```
   GROQ_API_KEY=gsk_your_actual_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to http://localhost:3000

## Usage

1. Enter an experiment title (e.g., "Implementation of Binary Search Tree")
2. Select a subject from the dropdown (C, Java, DBMS, Python)
3. Click "Generate Lab Record"
4. Wait for AI to generate the complete lab record (usually takes a few seconds)
5. Review and edit any section if needed
6. Click "Download DOCX" to get the formatted Word document
7. Click "Regenerate" to generate a new version

## Project Structure

```
LabFile/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Main page
│   │   ├── globals.css          # Global styles
│   │   └── api/
│   │       ├── generate/
│   │       │   └── route.ts     # Generate lab record API
│   │       └── download/
│   │           └── route.ts     # Download DOCX API
│   ├── components/
│   │   ├── InputForm.tsx        # Input form component
│   │   ├── LabRecordPreview.tsx # Preview & edit component
│   │   ├── LoadingSpinner.tsx   # Loading state
│   │   └── ErrorMessage.tsx     # Error display
│   ├── lib/
│   │   ├── groq.ts              # Groq API integration
│   │   └── docxGenerator.ts     # DOCX generation
│   └── types/
│       └── index.ts             # TypeScript types
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env.local
```

## API Routes

### POST /api/generate
Generates a lab record using Groq AI.

**Request Body**:
```json
{
  "experimentTitle": "Binary Search Tree",
  "subject": "C"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "aim": "...",
    "theory": "...",
    "algorithm": [...],
    "code": "...",
    "output": "...",
    "learningOutcomes": [...],
    "vivaQuestions": [...]
  }
}
```

### POST /api/download
Downloads a DOCX file of the lab record.

**Request Body**:
```json
{
  "labRecord": { ... },
  "experimentTitle": "Binary Search Tree"
}
```

**Response**: DOCX file download

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Getting Groq API Key

1. Visit https://console.groq.com
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy and paste it into `.env.local`

## Notes

- The AI generates content in JSON format with robust parsing
- All sections are editable after generation
- DOCX files are formatted with proper headings, monospace code, and Q&A format
- Error handling is implemented at every layer (API, AI, parsing, UI)

## License

MIT
