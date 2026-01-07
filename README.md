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