
# DevSentinel AI — Secure-by-Design Autonomous Development Platform

DevSentinel AI is a next-generation autonomous development platform that transforms user stories and code repositories into secure, deployable applications using a collaborative multi-agent LLM workflow. It scans repositories, detects vulnerabilities, applies auto-patches, and provides an enterprise-grade dashboard for full security visibility.

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

---

## 👥 Team

### **Naveen Patil — Lead Architect & Security Engineer**

[<img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" width="20" /> LinkedIn](https://www.linkedin.com/in/naveen-patil-3618b221a)

### **Panav Payappagoudar — Full Stack Engineer (Builder & CI/CD Integration)**

[<img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" width="20" /> LinkedIn](https://www.linkedin.com/in/panav-payappagoudar)

---

## 📄 License

This project is created for Techfest IIT Bombay AutoDev Hackathon.
All rights reserved — not open-source for production use.

---

## ⭐ Acknowledgements

* OWASP Top 10
* Azure DevOps documentation
* LangChain / AutoGen concepts

```
