# DeFi Risk Monitoring Dashboard

A production-ready, data-intensive frontend application for monitoring decentralized finance (DeFi) protocol health metrics, liquidation risks, and oracle data.

## Features

### Core Functionality
- **Dark/Light Mode**: Full theme support with persistent preference
- **Responsive Design**: Optimized for desktop (1920px), tablet (768px), and mobile (375px)
- **Loading States**: Skeleton screens for optimal UX during data fetching
- **Data Refresh**: Manual and automatic data refresh mechanisms

### Data Visualizations
1. **Risk Overview Cards (KPIs)**: Real-time metrics including TVL, utilization rate, health factor, and liquidations
2. **TVL Time Series Chart**: 30-day historical Total Value Locked trends
3. **Confidence Interval Chart**: Borrow rate predictions with 90-95% confidence intervals
4. **Liquidation Risk Heatmap**: Visual representation of positions at risk
5. **Asset Distribution**: Pie chart showing collateral composition
6. **Oracle Deviation Monitor**: Price feed discrepancies across oracle sources
7. **Protocol Comparison Table**: Sortable comparison of metrics across protocols

### Technical Features
- **TypeScript**: Full type safety for all data structures
- **DeFiLlama API Integration**: Live TVL data from real DeFi protocols
- **Mock Data Generation**: Realistic data patterns for development and testing
- **Professional UI**: Built with shadcn/ui and Recharts
- **WebSocket Simulation**: Real-time data updates every 5 seconds

## Setup

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. Clone or download the project
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Main entry point
│   ├── layout.tsx               # Root layout with metadata
│   └── globals.css              # Global styles and theme
├── components/
│   ├── dashboard-layout.tsx     # Main dashboard container
│   ├── dashboard-header.tsx     # Header with theme toggle
│   ├── dashboard-sidebar.tsx    # Protocol navigation sidebar
│   ├── protocol-overview.tsx    # KPI cards with real API data
│   ├── tvl-chart.tsx           # TVL time series chart
│   ├── confidence-interval-chart.tsx  # Confidence interval visualization
│   ├── liquidation-heatmap.tsx  # Risk position heatmap
│   ├── asset-distribution.tsx   # Collateral pie chart
│   ├── oracle-deviation.tsx     # Oracle event monitoring
│   ├── protocol-comparison.tsx  # Sortable comparison table
│   ├── error-boundary.tsx       # Error handling component
│   └── ui/                      # ui components
├── lib/
│   ├── mock-data.ts            # Mock data generators
│   ├── defillama-api.ts        # DeFiLlama API integration
│   ├── websocket-simulator.ts  # WebSocket simulation
│   └── utils.ts                # Utility functions
├── types/
│   └── defi.ts                 # TypeScript type definitions
└── hooks/
    └── use-theme.tsx           # Theme management hook
\`\`\`

## API Integration

The dashboard integrates with DeFiLlama's public API to fetch real TVL data:

\`\`\`typescript
// Example API call
const data = await fetchDefiLlamaData('aave')
console.log(data.tvl) // Real-time TVL value
\`\`\`

Supported protocols:
- Aave
- Compound
- MakerDAO
- Curve
- Uniswap

## Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **Recharts**: Data visualization library
- **Lucide React**: Icon system
- **DeFiLlama API**: Real DeFi protocol data

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Production Link
https://de-fi-dashboard-kappa.vercel.app/