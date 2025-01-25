# Summary 

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

# Tech Stack Overview

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

# Auth Proxy

This is a simple proxy server that enables OAuth authentication for preview environments and Expo apps.

## Setup

Deploy it somewhere (Vercel is a one-click, zero-config option) and set the following environment variables:

- `AUTH_GITHUB_ID` - The GitHub OAuth client ID
- `AUTH_GITHUB_SECRET` - The GitHub OAuth client secret
- `AUTH_REDIRECT_PROXY_URL` - The URL of this proxy server (e.g. )
- `AUTH_SECRET` - Your secret

Make sure the `AUTH_SECRET` and `AUTH_REDIRECT_PROXY_URL` match the values set for the main application's deployment for preview environments, and that you're using the same OAuth credentials for the proxy and the application's preview environment.
`AUTH_REDIRECT_PROXY_URL` should only be set for the main application's preview environment. Do not set it for the production environment.
The lines below shows what values should match eachother in both deployments.

> [!NOTE]
>
> For using the proxy for local development set the `AUTH_REDIRECT_PROXY_URL` in the `.env` file as well.

![Environment variables setup](https://github.com/t3-oss/create-t3-turbo/assets/51714798/5fadd3f5-f705-459a-82ab-559a3df881d0)

For providers that require an origin and a redirect URL, set them to `{AUTH_REDIRECT_PROXY_URL}` and `{AUTH_REDIRECT_PROXY_URL}/r/callback/{provider}` accordingly.

![Google credentials setup](https://github.com/ahkhanjani/create-t3-turbo/assets/72540492/eaa88685-6fc2-4c23-b7ac-737eb172fa0e)
