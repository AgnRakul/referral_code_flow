# Referral Flow System

## Summary
A web3-enabled referral system that allows users to generate and share referral codes while implementing a multi-layered authentication system. Users can authenticate through social logins (Twitter/Google) and gain additional access through Web3 wallet or Apple ID integration.

### Key Features
- Referral code generation and validation
- Multi-layer authentication (Social + Web3/Apple)
- Points system for successful referrals
- Protected routes based on authentication level
- Real-time notifications for system events

## Technology Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Features**:
  - RESTful API endpoints
  - Social OAuth integration (Twitter/Google)
  - Apple Sign-in
  - Web3 wallet integration
  - JWT-based authentication
  - Points management system

### Frontend
- **Framework**: React
- **Web3**: MetaMask/Phantom integration
- **Styling**: TailwindCSS
- **Features**:
  - Social login components
  - Wallet connection
  - Apple Sign-in
  - Protected routing
  - Toast notifications

## Prerequisites
- Node.js and npm installed
- PostgreSQL database
- Social OAuth credentials (Twitter/Google)
- Apple Developer account
- MetaMask or Phantom wallet

## Installation
1. Install dependencies:
```bash
npm install
```

## Environment Setup
Create `.env` files in the following locations:

### Server Environment Variables
Location: `apps/server/.env`
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/referral_db"

# Server
PORT=3000
NODE_ENV=development

# OAuth
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Apple Sign-in
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h
```

### Client Environment Variables
Location: `apps/client/.env`
```
VITE_API_URL=http://localhost:3000
VITE_TWITTER_CLIENT_ID=your_twitter_client_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_APPLE_CLIENT_ID=your_apple_client_id
```

## Running the Application

### Start the Server
```bash
cd apps/server
npm run start:dev
```

### Start the Client
```bash
cd apps/client
npm run dev
```

## User Flow
1. User visits via referral link or direct access
2. System validates referral code if present
3. User authenticates via Twitter/Google
4. Points awarded for valid referrals
5. Additional authentication (Apple/Web3) for advanced features

## System Documentation

### Database Schema
[View Database Schema](https://dbdiagram.io/d/Referral-Flow-System-66c9e929a346f9518cf7fea7)

### System Design
[View System Flow Diagram](https://lucid.app/lucidspark/72907e35-6f46-4d61-a343-7427e0957df6/edit?invitationId=inv_b46f7a28-2f19-4c23-af41-9a7f2df71dfa)

## Project Structure
```
referral-flow/
├── apps/
│   ├── server/         # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/   # Authentication modules
│   │   │   ├── referral/  # Referral logic
│   │   │   └── user/   # User management
│   │   └── prisma/     # Database schema
│   └── client/         # React frontend
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   └── hooks/
│       └── public/
└── package.json
```
