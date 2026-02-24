# DevSentinel AI — Secure-by-Design Autonomous Development Platform

DevSentinel AI autonomously scans, detects, and patches security issues in code repositories using a multi-agent LLM pipeline. This repository contains the prototype application and Sentinel scanning engine used for demos and research.

**Live demo:** previously hosted on Vercel (devsentinel-ai.vercel.app) — currently unavailable. The README has been updated to remove the broken direct link.

---

## 🔥 Key Capabilities

- Multi-agent pipeline (Architect → Builder → Critic → Sentinel)
- Security scanning (pattern + LLM-assisted analysis)
- Automated patch suggestions and patch diff viewer
- GitHub integration for creating PRs with fixes

---

## 🛡️ Core Features

- Enterprise-style dashboard (Next.js + Tailwind)
- Upload & scan (ZIP upload, GitHub repo ingestion)
- Vulnerability reporting and timeline
- Patch export and commit automation

---

## 📁 Project Structure (high-level)

app/ — Next.js App Router pages and API routes
components/ — shared UI components
lib/ — core scanning, orchestration and helpers
services/ — offensive/red-team validation tools (demo)
supabase/ — example DB schema

---

## 🧪 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS, shadcn/ui
- Supabase (backend demo)

---

## 🚀 Getting Started (local)

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from the example and fill required keys (do not commit secrets):

```bash
cp .env.local.example .env.local
```

3. Run dev server:

```bash
npm run dev
```

Open http://localhost:3000

---

## 🔧 Deployment

This project is compatible with Vercel, but the public demo is currently offline. To deploy yourself, use Vercel or any Node-compatible host and set environment variables in the host's dashboard.

---

## 🔒 Security notes

- Do not commit `.env*` or secrets into git. Rotate keys if they are accidentally committed.
- The repository contains demo/vulnerable artifacts used for testing. Review and remove these before production use.
- Avoid embedding tokens in commands (see `app/api/upload/route.ts`) and ensure any GitHub tokens are handled via secure auth flows.

---

## License & Acknowledgements

This prototype was created for Techfest IIT Bombay AutoDev Hackathon. See the `LICENSE` file for details.

Acknowledgements: OWASP, Azure OpenAI, NeuroSploit-inspired research, Supabase.


## 📄 License

This project is created for Techfest IIT Bombay AutoDev Hackathon.
All rights reserved — not open-source for production use.

---

## ⭐ Acknowledgements

* OWASP Top 10
* Azure DevOps documentation
* LangChain / AutoGen concepts

```
>>>>>>> e0b153e50be9ca02592341547d56667980482bfa

# DevSentinel AI - Secure-by-Design Autonomous Development Platform

DevSentinel AI is an advanced security platform that autonomously scans, detects, and patches vulnerabilities in code repositories using a multi-agent LLM pipeline.

## 🚀 Features

- **Multi-Agent LLM Pipeline**: Architect → Builder → Critic → Sentinel agents work together to analyze and secure your code
- **Red-Team Validation Gate**: Dynamic exploit validation using NeuroSploit-inspired techniques for "Offensive Security as Code"
- **Smart Vulnerability Detection**: Uses LLMs to identify complex security vulnerabilities beyond traditional pattern matching
- **Automated Patching**: AI-generated secure code patches with backup/restore functionality
- **GitHub Integration**: Automatically commit fixes as pull requests to your repositories
- **Supabase Backend**: Full-featured dashboard with project management, scan history, and timeline tracking
- **Real-time Dashboard**: Enterprise-grade UI with vulnerability analytics and patch management
- **Red-Team Terminal**: Visual attack log interface showing exploit attempts and mitigation status

## 🏗️ Architecture

DevSentinel AI is built around the Azure AI Foundry ecosystem, providing enterprise-grade security and scalability:

1. **Azure OpenAI Service** powers the core multi-agent orchestration (Architect → Builder → Critic → Sentinel → Red-Team)
2. **Azure AI Content Safety** provides real-time guardrails on all agent outputs and user inputs
3. **Azure Key Vault** manages all secrets and API keys securely
4. **Azure App Service** hosts the application with built-in security and scaling
5. **Azure Cosmos DB** (planned migration from Supabase) provides globally distributed database capabilities

The pipeline flows through Azure services to ensure enterprise compliance and security.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase (Database & Auth) with future migration to Azure Cosmos DB
- **AI Orchestration**: Azure OpenAI Service (GPT-4o & o1-preview)
- **Safety & Ethics**: Azure AI Content Safety (Prompt Shields & Protected Material Detection)
- **Security**: Multi-agent pipeline, automated patching, GitHub PR integration, Azure Key Vault for secrets
- **Infrastructure**: GitHub Actions for CI/CD and Azure App Service for hosting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- LLM API keys (OpenRouter, Gemini, Groq, Together AI)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd devsentinel-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.local.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure Supabase**:
   - Create a new project on [Supabase](https://supabase.com/)
   - Copy your project URL and API keys to `.env.local`
   - Apply the database schema from `supabase/schema.sql`

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Visit `http://localhost:3000` to access the dashboard.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables (Azure variables take priority):

```bash
# Azure Configuration (Primary)
AZURE_OPENAI_API_KEY=your-azure-openai-key
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
AZURE_OPENAI_DEPLOYMENT_NAME=your-azure-deployment-name
AZURE_CONTENT_SAFETY_KEY=your-azure-content-safety-key
AZURE_CONTENT_SAFETY_ENDPOINT=your-azure-content-safety-endpoint

# Azure Key Vault (Future Implementation)
AZURE_KEY_VAULT_NAME=your-key-vault-name

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration (Migration Path to Azure Cosmos DB)
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Public Supabase (for client-side)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Fallback LLM API Keys (Azure First)
OPENROUTER_API_KEY=your-openrouter-key
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key
TOGETHER_API_KEY=your-together-key
```

## 🗄️ Supabase Setup

1. Create a new Supabase project
2. Enable Email authentication in Supabase Auth settings
3. Apply the database schema:
   ```sql
   -- Run the SQL from supabase/schema.sql in your Supabase SQL editor
   ```
4. Configure Row Level Security (RLS) policies as needed

## 📁 Project Structure

```
app/                    # Next.js 14 App Router pages
├── api/               # API routes
├── dashboard/         # Main dashboard pages
├── login/             # Authentication pages
├── patches/           # Patch management
├── scan-results/      # Scan results display
├── settings/          # User settings
├── timeline/          # Security timeline
└── upload/            # Project upload interface

components/            # Reusable UI components
├── RedTeamTerminal.tsx # Red-Team Terminal UI component
└── other components...

services/              # Offensive security engine
├── offensive_engine/   # NeuroSploit integration and offensive tools
│   ├── neurosploit-integration.ts # Core offensive logic
│   ├── osint-collector.ts # OSINT collection wrapper
│   └── offensive-tools.ts # Tool interface for LLMs

lib/                   # Core business logic
├── llm.ts            # LLM provider integration
├── orchestrator.ts   # Multi-agent pipeline
├── sentinel.ts       # Security scanning engine
├── security-auditor-agent.ts # Security auditor with offensive tools
├── patcher.ts        # Auto-patching system
├── github.ts         # GitHub integration
└── supabase.ts       # Supabase client utilities

supabase/              # Supabase configuration
styles/                # Global styles
```

## 🤖 Multi-Agent Pipeline

### 1. Architect Agent
Analyzes project structure and identifies high-risk areas for security scanning.

### 2. Builder Agent
Creates a detailed scanning strategy based on architectural analysis.

### 3. Critic Agent
Reviews the scanning approach and suggests improvements to reduce false positives.

### 4. Sentinel Agent
Executes the security scan using both LLM analysis and traditional pattern matching.

### 5. Red-Team Validation Gate
Performs dynamic exploit validation using NeuroSploit-inspired offensive techniques to ensure vulnerabilities are not just detected but truly patched and non-exploitable.

## 🔒 Security Features

- **Path Traversal Prevention**: All file operations are validated to prevent directory traversal attacks
- **Input Validation**: Comprehensive validation on all API endpoints
- **Secure LLM Routing**: Centralized LLM provider management with error handling
- **Backup/Restore**: Automatic backups before applying patches
- **Audit Trail**: Complete timeline of all security events

## 🌍 Inclusive Security

DevSentinel AI is committed to accessibility and inclusion through:

- **Plain-English Security Explainer**: An Azure OpenAI-powered agent that translates complex CVE and NeuroSploit logs into accessible language for non-technical, diverse founders
- **WCAG 2.1 Compliance**: Dashboard designed to meet Web Content Accessibility Guidelines 2.1 standards
- **Inclusive Design**: Microsoft Fluent Design principles ensuring the platform is usable by people with diverse abilities and backgrounds

## 🚀 Deployment

### Azure App Service Deployment

1. Push your code to a GitHub repository
2. Configure GitHub Actions for CI/CD
3. Deploy to Azure App Service with Azure CLI
4. Configure Azure Application Insights for monitoring

### Commercial Viability

DevSentinel AI offers a $20/month Pro tier that specifically covers the cost of High-Inference Azure o1 reasoning for automated patching. This enterprise-grade tier includes:

- Advanced reasoning with Azure OpenAI o1-preview for complex vulnerability analysis
- Priority support and SLA guarantees
- Advanced reporting and compliance features
- Enhanced security scanning with custom NeuroSploit skill integration

### Environment Variables for Production

Make sure to set all the environment variables in your Vercel project settings.

## 🧪 Testing

Run the LLM connectivity test:
```bash
curl http://localhost:3000/api/test-llm
```

## 📊 Dashboard Features

- **Project Overview**: Summary of all scanned projects
- **Vulnerability Analytics**: Severity distribution and trends
- **Patch Management**: View, apply, and export security patches
- **Security Timeline**: Chronological view of all security events
- **Settings**: Configure LLM providers and GitHub integration

## 🆘 Troubleshooting

### Common Issues

1. **LLM API Errors**: Check your API keys in `.env.local`
2. **Supabase Connection**: Verify your Supabase URL and keys
3. **GitHub Integration**: Ensure your GitHub token has proper permissions
4. **File Access Errors**: Check directory permissions and path validations

### Need Help?

- Check the console logs for detailed error messages
- Verify all environment variables are correctly set
- Ensure your Supabase schema is properly applied

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Azure OpenAI Service](https://azure.microsoft.com/en-us/products/ai-services/ai-openai) - Enterprise-grade LLM orchestration
- [Azure AI Content Safety](https://azure.microsoft.com/en-us/products/ai-services/ai-content-safety) - Content safety and responsible AI
- [Azure App Service](https://azure.microsoft.com/en-us/products/app-service) - Enterprise hosting
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/) - Secure secret management
- [Azure Cosmos DB](https://azure.microsoft.com/en-us/products/cosmos-db) - Globally distributed database
- [NeuroSploit](https://github.com/CyberSecurityUP/NeuroSploit) - Custom security skill framework (integrated as Azure Cognitive Skill)
- [Supabase](https://supabase.com/) - Database and authentication (migration path to Azure Cosmos DB)
=======

# DevSentinel AI — Secure-by-Design Autonomous Development Platform

DevSentinel AI is a next-generation autonomous development platform that transforms user stories and code repositories into secure, deployable applications using a collaborative multi-agent LLM workflow. It scans repositories, detects vulnerabilities, applies auto-patches, and provides an enterprise-grade dashboard for full security visibility.

<a href="https://devsentinel-ai.vercel.app" target="_blank">
  <svg width="100%" height="150" viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0" stop-color="#0ea5a4"/>
        <stop offset="1" stop-color="#7c3aed"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="300" rx="16" fill="url(#g)"/>
    <text x="60" y="110" font-family="Segoe UI, Roboto, Arial" font-size="44" fill="#fff" font-weight="700">DevSentinel AI</text>
    <text x="60" y="160" font-family="Segoe UI, Roboto, Arial" font-size="18" fill="#f0f9f9">Secure-by-design autonomous development — Try the live demo</text>
    <rect x="60" y="185" rx="8" width="190" height="44" fill="#000" opacity="0.14"/>
    <a href="https://devsentinel-ai.vercel.app"><text x="80" y="213" font-family="Segoe UI, Roboto, Arial" font-size="16" fill="#fff">▶ Try Live Demo</text></a>
    <g transform="translate(1040,60)">
      <!-- small vercel-like triangle -->
      <polygon points="30,0 60,52 0,52" fill="#fff"/>
    </g>
  </svg>
</a>


---

## 🔥 Key Capabilities

### 🧠 Multi-Agent Architecture
DevSentinel AI uses four collaborating agents:

- **Architect Agent** — Converts Azure DevOps user stories into architecture plans  
- **Builder Agent** — Generates initial full-stack code  
- **Critic Agent** — Produces test stubs and basic validation  
- **Sentinel Agent** — Performs security scanning and automated patching  

The prototype demonstrates the Sentinel module fully, with partial integration for Architect/Builder/Critic via LLM workflows.

---

## 🛡️ Core Features

### Enterprise Security Dashboard
- Modern sidebar & navbar  
- Dark mode optimized  
- Fully responsive  
- Built with Next.js 14 + Tailwind + shadcn/ui  

### Upload & Scan
- Drag-and-drop ZIP upload  
- GitHub repo ingestion  
- Real-time scanning feedback  

### Security Findings & Auto-Patching
- Severity-based vulnerability cards  
- Detailed findings table  
- Patch diff viewer  
- Export patched repo as ZIP  

### Security Timeline
- Chronological scan history  
- Patch events  
- Security posture trends  

### Agent Orchestration (MVP)
- Sequential flow (Architect → Builder → Critic → Sentinel)  
- Agent execution logs  
- Builder/Critic sample outputs  

---

## 📁 Project Structure

```

app/
├── layout.tsx
├── page.tsx
├── upload/
├── scan-results/
├── timeline/
├── patches/
├── settings/
└── test-components/

components/
├── Sidebar.tsx
├── Navbar.tsx
├── ScanContext.tsx
├── VulnerabilityCard.tsx
├── VulnerabilityTable.tsx
├── Timeline.tsx
├── PatchDiff.tsx
└── LoadingSkeletons.tsx

lib/
├── sentinel.ts
├── orchestrator.ts
├── extractZip.ts
├── github.ts
└── supabase.ts

app/api/
├── upload/
├── scan/
├── patch/
└── commit/

````

---

## 🧪 Tech Stack

- **Framework:** Next.js 14 (App Router)  
- **Language:** TypeScript  
- **UI:** Tailwind CSS, shadcn/ui, Lucide icons  
- **State:** React Context API  
- **Deployment:** Vercel  

---

## 🚀 Getting Started Locally

Install dependencies:

```bash
npm install
````

Run development server:

```bash
npm run dev
```

Project runs at:

**[http://localhost:3000](http://localhost:3000)**

### Production Build

```bash
npm run build
npm start
```

---

## 🔧 Deploying to Vercel

This project is fully compatible with **Vercel's Next.js 14 App Router environment**.

### **Automatic Deployment (Recommended)**

1. Push your code to GitHub
2. Go to [https://vercel.com](https://devsentinel-ai.vercel.app/)
3. Import your GitHub repository
4. Vercel auto-detects the Next.js config
5. Click **Deploy**

### **Manual Deployment Using Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel            # preview deployment
vercel --prod     # production deployment
```

If Vercel fails to deploy, check:

* Missing dependencies in `package.json`
* Invalid `.env` files
* Mismatched or broken markdown blocks
* Incorrect import paths
* Server route errors under `/app/api/*`

---

## 📌 Development Guidelines

* Dark mode support throughout
* Mobile-first responsive design
* Tailwind + shadcn for consistent UI
* TypeScript strict mode enabled
* Sentinel scanning logic located in `/lib/sentinel.ts`
* DO NOT commit `.env` files or secrets



## 📄 License

This project is created for Techfest IIT Bombay AutoDev Hackathon.
All rights reserved — not open-source for production use.

---

## ⭐ Acknowledgements

* OWASP Top 10
* Azure DevOps documentation
* LangChain / AutoGen concepts

```
>>>>>>> e0b153e50be9ca02592341547d56667980482bfa
