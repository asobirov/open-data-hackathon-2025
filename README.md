# Ducktective

## Team: Restarted Ducks

### Team Members:
- Sabrina Babakulova
- Akbrashokh Sobirov
- Saidbek Abdiganiev

## Summary 

Ducktective is an AI-powered tool designed to analyze tenders from the open data platform [etender.uzex.uz](https://etender.uzex.uz/home). The platform utilizes advanced algorithms and data analysis techniques to identify irregularities, ensure transparency, and flag suspicious activity in public procurement processes.

**Core Features:**

1. **Tender Analysis and Anomaly Detection**:
    - Compares new tenders with historical data using vector embeddings for similarity searches.
    - Identifies unusual patterns in purchasing behavior, prices, and other parameters.
2. **Company Verification**:
    - Retrieves and cross-references company details from external platforms (orginfo.uz, myorg.uz).
    - Flags companies linked to suspicious directors, shareholders, or other entities.
3. **Document Inspection**:
    - Analyzes attached documents to validate criteria like licenses and compliance.
    - Uses AI to compute final scores and flag discrepancies.
4. **Background Checks**:
    - Investigates social media and web activities of key personnel linked to tenders.
    - Evaluates market pricing to detect potential overcharging.
5. **Competitor Assessment**:
    - Confirms if competing companies have genuine capabilities.
    - Highlights connections between competitors and tender organizers.

**Report Generation:**  
Ducktective provides a detailed report for each analyzed tender:

- A summary of the customer, winner, and competitors.
- A chain of events with a pass/fail status for background checks.
- Visualized data in charts (using mermaid.js).
- A verdict (e.g., Clean, Suspicious, Moderately Suspicious).

This report is stored in a database and displayed on the dashboard, offering actionable insights and improving procurement transparency.

## Tech Stack Overview

**Setup:**
* **Turborepo**
* **pnpm**

**Frontend:**

- **Next.js**
- **Shadcn/ui**

**Backend:**

- **Prisma**
- **PostgreSQL (via Supabase)**
- **tRPC**
- **Supabase Vector**
- **LangChain**
- **GROQ LLM** _(temporary)_
- **Web Crawler** _(pending decision)_

**Additional:**
- **Bun** *(for scripting)*
- **Python** *(data cleaning)*

