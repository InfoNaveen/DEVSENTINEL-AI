# DevSentinel AI - Enterprise Security Dashboard

A premium, enterprise-grade security dashboard for automated vulnerability scanning and auto-patching.

## Folder Structure

```
app/
├── layout.tsx                 # Root layout with sidebar and navbar
├── page.tsx                   # Homepage
├── upload/
│   └── page.tsx              # Upload & scan page
├── scan-results/
│   └── page.tsx              # Scan results dashboard
├── timeline/
│   └── page.tsx              # Security timeline
├── patches/
│   └── page.tsx              # Applied patches
├── settings/
│   └── page.tsx              # Settings page
└── test-components/
    └── page.tsx              # Component testing page

components/
├── Sidebar.tsx               # Navigation sidebar
├── Navbar.tsx                # Top navigation bar
├── ScanContext.tsx           # Global state management
├── VulnerabilityCard.tsx     # Summary cards
├── VulnerabilityTable.tsx    # Vulnerability listing table
├── Timeline.tsx              # Security timeline component
├── PatchDiff.tsx             # Code diff viewer
├── LoadingSkeletons.tsx      # Loading placeholders
└── TestComponent.tsx         # Component testing

lib/
├── sentinel.ts               # Security scanning engine
├── orchestrator.ts          # Agent coordination
├── extractZip.ts            # ZIP file extraction
├── github.ts                # GitHub integration
└── supabase.ts              # Database integration (stubs)

app/api/
├── upload/
│   └── route.ts             # File upload handler
├── scan/
│   └── route.ts             # Security scanning
├── patch/
│   └── route.ts             # Auto-patching
└── commit/
    └── route.ts             # GitHub commit
```

## Key Features

1. **Enterprise Dashboard Layout**
   - Responsive sidebar navigation
   - Dark mode support
   - Professional UI components

2. **Upload & Scan**
   - Drag-and-drop ZIP file upload
   - GitHub repository integration
   - Real-time scanning progress

3. **Scan Results**
   - Vulnerability summary cards
   - Detailed findings table
   - Severity filtering
   - Patch status indicators

4. **Patch Management**
   - Before/after code diff viewer
   - Patch history tracking
   - Export patched code

5. **Security Timeline**
   - Visual scan history
   - Event-based logging
   - Trend analysis

6. **Responsive Design**
   - Mobile-friendly interface
   - Tablet-optimized layouts
   - Desktop-enhanced experiences

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Deployment**: Vercel-compatible

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting

## Development Guidelines

- All components use Tailwind CSS for styling
- Dark mode support is implemented throughout
- Responsive design follows mobile-first approach
- TypeScript is used for type safety
- Component composition follows atomic design principles

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is proprietary and confidential. All rights reserved.