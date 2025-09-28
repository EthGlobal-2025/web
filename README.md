# Web Frontend

This is the frontend application for the expense tracking project built with Next.js and Web3 integration.

## Project Overview

This web application provides:

- Modern React-based frontend using Next.js 14
- Web3 integration with wagmi for Ethereum interactions
- Expense tracking and management interface
- Group expense management features
- Responsive UI built with Tailwind CSS and shadcn/ui components

## Features

- **Expense Management**: Create, track, and manage expenses
- **Group Functionality**: Create and manage expense groups
- **Web3 Integration**: Connect wallets and interact with smart contracts
- **Dashboard**: View expense analytics and summaries
- **File Upload**: Upload receipts and documents

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Web3**: wagmi, ethers.js
- **State Management**: React hooks
- **Build Tool**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MetaMask or other Web3 wallet

### Installation

1. Clone the repository:

```bash
git clone https://github.com/EthGlobal-2025/web.git
cd web
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/           # Next.js app router pages
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and services
├── modules/       # Feature-specific modules
├── providers/     # Context providers
└── types/         # TypeScript type definitions
```

## Smart Contract Integration

This frontend connects to the expense tracking smart contract. Make sure you have:

- The contract deployed on your target network
- Correct contract addresses configured
- ABI files up to date in the `/abis` directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Related Repositories

- [Contract Repository](https://github.com/EthGlobal-2025/contract) - Smart contracts for expense tracking
