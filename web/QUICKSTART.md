# Quick Start Guide - Wallet Connection

Follow these steps to get the wallet connection working:

## Step 1: Get WalletConnect Project ID

1. Go to [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in the frontend directory:

```bash
# In frontend directory
cp .env.example .env.local
```

2. Edit `.env.local` and add your WalletConnect Project ID:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

## Step 3: Run the Development Server

```bash
npm run dev
```

## Step 4: Test the Wallet Connection

1. Open your browser and go to [http://localhost:3000/wallet](http://localhost:3000/wallet)
2. Click "Connect Wallet"
3. Select your preferred wallet (MetaMask, WalletConnect, or Coinbase Wallet)
4. Approve the connection in your wallet

## Using in Your Components

### Basic Usage

```tsx
import { ConnectWallet } from '@/components/connect-wallet'

export default function MyPage() {
  return (
    <div>
      <ConnectWallet />
    </div>
  )
}
```

### With Custom Hook

```tsx
'use client'

import { useWallet } from '@/hooks/use-wallet'
import { ConnectWallet } from '@/components/connect-wallet'

export default function MyPage() {
  const { isConnected, address, balance, formatAddress, formatBalance } = useWallet()

  return (
    <div>
      <ConnectWallet />
      
      {isConnected && (
        <div>
          <p>Address: {formatAddress(address)}</p>
          {balance && (
            <p>
              Balance: {formatBalance(balance.value.toString(), balance.decimals)} {balance.symbol}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
```

### Display Wallet Info

```tsx
import { WalletInfo } from '@/components/wallet-info'

export default function MyPage() {
  return (
    <div>
      <WalletInfo />
    </div>
  )
}
```

## Available Networks

The configuration includes:

- **Mantle Mainnet** (Chain ID: 5000)
- **Mantle Sepolia Testnet** (Chain ID: 5003)
- **Ethereum Mainnet** (Chain ID: 1)
- **Ethereum Sepolia Testnet** (Chain ID: 11155111)

## Troubleshooting

### "Invalid Project ID" Error
- Make sure your `.env.local` file has `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- Restart the dev server after creating/updating `.env.local`

### MetaMask Not Detected
- Install MetaMask browser extension
- Refresh the page

### Wrong Network
- The wallet will prompt you to switch networks
- Or manually switch in your wallet to one of the supported networks

## What's Included

✅ **Components:**
- `ConnectWallet` - Main connection button with dropdown
- `WalletInfo` - Detailed wallet information card
- `Web3Provider` - Wagmi provider wrapper

✅ **Hooks:**
- `useWallet` - Custom hook with wallet utilities

✅ **Configuration:**
- Wagmi config with Mantle networks
- Multiple wallet connectors
- Public RPC endpoints

✅ **Features:**
- Multi-wallet support (MetaMask, WalletConnect, Coinbase)
- Real-time balance updates
- ENS name resolution
- Network switching
- Copy address to clipboard
- Block explorer links

## Next Steps

- Add your custom smart contract interactions
- Implement transaction signing
- Add custom network configurations
- Style components to match your design

For detailed documentation, see [WALLET_SETUP.md](./WALLET_SETUP.md)
