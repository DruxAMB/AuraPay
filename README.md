# 🏦 AuraPay

<div align="center">

![AuraPay Logo](https://img.shields.io/badge/AuraPay-USDC%20Wallet-00D4AA?style=for-the-badge&logo=ethereum&logoColor=white)

**Modern USDC Wallet on Avalanche Blockchain**

*Send and receive stablecoin payments with NFC card—no phone required*

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.15-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.15.0-FF0055?style=flat-square&logo=framer)](https://www.framer.com/motion/)

</div>

---

## 🌟 Overview

**AuraPay** is a next-generation cryptocurrency wallet designed for **USDC transactions on the Avalanche blockchain**. Combining banking-grade UX with cutting-edge blockchain technology, AuraPay makes stablecoin payments accessible to everyone through innovative **NFC card integration**.

### ✨ Key Highlights

- 🏦 **Banking-Grade Interface** - Professional, trust-building design
- ⚡ **Avalanche-Powered** - Sub-second transactions with minimal fees
- 💳 **NFC Card Payments** - Send/receive without using your phone
- 🔒 **Advanced Security** - Panic mode, PIN protection, Google OAuth
- 🚀 **Gasless Transactions** - No AVAX fees for USDC transfers
- 📱 **Mobile-First** - Optimized for touch interactions

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--background: #121212     /* Deep charcoal background */
--surface: #1E1E1E        /* Card and component surfaces */
--primary: #00D4AA        /* Teal accent for CTAs */
--secondary: #0EA5E9      /* Blue for secondary actions */

/* Text Colors */
--text-primary: #FFFFFF    /* Primary text */
--text-secondary: #A1A1AA  /* Secondary text */
--text-muted: #71717A      /* Muted text */

/* Status Colors */
--success: #22C55E         /* Transaction success */
--warning: #F59E0B         /* Pending states */
--error: #EF4444          /* Error states */
```

### Typography
- **Primary Font**: Inter (Clean, modern sans-serif)
- **Secondary Font**: Roboto (Readable, professional)
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Design Principles
- **Trust & Credibility** - Professional appearance builds user confidence
- **Simplicity** - Clean, uncluttered interfaces reduce cognitive load
- **Accessibility** - High contrast ratios and touch-friendly interactions
- **Consistency** - Unified spacing, colors, and component patterns

---

## 🚀 Features

### 💰 Wallet Management
- **USDC Balance Tracking** - Real-time balance updates on Avalanche
- **Secure Wallet Creation** - Industry-standard private key management
- **Multi-Device Sync** - Access your wallet across devices
- **Transaction History** - Detailed records with status tracking

### 💳 Payment System
- **NFC Card Integration** - Physical card for contactless payments
- **QR Code Payments** - Scan to send/receive instantly
- **Gasless Transfers** - Permit-based transactions (no AVAX required)
- **PIN Authorization** - Secure transaction approval

### 🔐 Security Features
- **Google OAuth** - Seamless, secure authentication
- **Panic Mode** - Emergency feature to hide funds
- **Reverse PIN** - Special PIN activates stealth mode
- **End-to-End Encryption** - All sensitive data encrypted

### 🌐 Communication
- **WhatsApp Integration** - Transaction notifications via WhatsApp
- **Real-Time Updates** - WebSocket-powered live updates
- **Multi-Language Support** - Global accessibility

---

## 🛠️ Tech Stack

### Frontend Architecture

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework with hooks and context |
| **TypeScript** | 5.6.2 | Type safety and developer experience |
| **Vite** | 6.0.1 | Fast build tool and dev server |
| **Tailwind CSS** | 3.4.15 | Utility-first CSS framework |
| **Framer Motion** | 11.15.0 | Smooth animations and transitions |
| **React Router** | 6.28.0 | Client-side routing |
| **Heroicons** | 2.2.0 | Beautiful SVG icons |

### State Management
- **React Context** - Global authentication and app state
- **Custom Hooks** - Reusable stateful logic
- **Local Storage** - Persistent user preferences

### Animation System
- **Framer Motion** - Page transitions, modal animations
- **CSS Transitions** - Micro-interactions and hover effects
- **Spring Physics** - Natural, bouncy animations

---

## 📱 Pages & Components

### Core Pages
- **🏠 Landing** - Hero section, features, call-to-action
- **🔐 Authentication** - Google OAuth integration
- **🏦 Home** - Balance display, recent transactions
- **💸 Withdraw** - Send USDC with preview and confirmation
- **📥 Receive** - QR codes and NFC card options
- **📊 Transactions** - Complete transaction history
- **⚙️ Settings** - Profile, security, panic mode

### Key Components
- **🎭 TransactionDetailsModal** - Rich transaction information
- **🔄 LoadingSpinner** - Elegant loading states
- **🍔 AnimatedHamburger** - Mobile menu toggle
- **🎨 ProtectedRoute** - Authentication guards

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/useaura/frontend.git
cd aurapay-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://aurapay-backend.onrender.com/api

# Google OAuth (optional for development)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🏗️ Project Structure

```
src/
├── 📁 components/          # Reusable UI components
│   ├── LoadingSpinner.tsx  # Loading states
│   ├── Modal.tsx           # Base modal component
│   └── TransactionDetailsModal.tsx
├── 📁 contexts/            # React context providers
│   ├── AuthContext.tsx     # Authentication state
│   └── LoadingContext.tsx  # Global loading state
├── 📁 hooks/               # Custom React hooks
│   └── useNavigateWithLoading.ts
├── 📁 lib/                 # Utilities and API client
│   └── api.ts              # Centralized API client
├── 📁 pages/               # Page components
│   ├── Auth/               # Authentication pages
│   ├── Home/               # Dashboard and balance
│   ├── Landing/            # Marketing landing page
│   ├── Transactions/       # Transaction history
│   └── Settings/           # User preferences
├── 📁 routes/              # Routing configuration
│   └── AppRoutes.tsx       # Route definitions
├── 📁 services/            # Business logic
│   └── authService.ts      # Authentication service
└── 📁 config/              # Configuration files
    └── config.ts           # Environment config
```

---

## 🎨 Design Features

### Dark Theme
- **Deep charcoal backgrounds** (#121212) for reduced eye strain
- **High contrast text** for excellent readability
- **Teal accents** (#00D4AA) for primary actions
- **Blue highlights** (#0EA5E9) for secondary elements

### Responsive Design
- **Mobile-first approach** with touch-friendly interactions
- **Breakpoint system**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible layouts** that adapt to any screen size
- **Touch targets** minimum 44px for accessibility

### Animation Philosophy
- **Purposeful motion** that guides user attention
- **Spring-based physics** for natural feel
- **Staggered reveals** for content hierarchy
- **Reduced motion support** for accessibility

---

## 🔧 Development

### Code Quality
- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Husky** - Git hooks for quality gates

### Performance
- **Vite HMR** - Instant hot module replacement
- **Code splitting** - Lazy-loaded route components
- **Tree shaking** - Eliminate unused code
- **Bundle analysis** - Optimize bundle size

### Testing Strategy
- **Component testing** with React Testing Library
- **E2E testing** with Playwright
- **Type safety** with TypeScript
- **Manual testing** across devices and browsers

---

## 🌟 Key Innovations

### NFC Card Integration
- **Physical payment card** linked to digital wallet
- **Contactless payments** without phone dependency
- **Secure chip technology** for transaction authorization
- **Real-time balance updates** across card and app

### Gasless Transactions
- **Permit-based transfers** eliminate gas fees
- **Meta-transaction support** for seamless UX
- **Backend gas sponsorship** for user convenience
- **Cost-effective** USDC transfers

### Panic Mode Security
- **Emergency fund hiding** with one-tap activation
- **Reverse PIN trigger** for stealth activation
- **Transaction disabling** during panic state
- **Privacy protection** in sensitive situations

---

## 📄 License

This project is proprietary software. All rights reserved.

---

<div align="center">

**Built with ❤️ for the future of digital payments**

*Making cryptocurrency accessible to everyone*

</div>
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
