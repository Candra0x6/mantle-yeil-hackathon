# Wallet Connection Setup

This project uses Wagmi v2 for Web3 wallet connections with support for MetaMask, WalletConnect, and Coinbase Wallet.

## Features

- ✅ Multiple wallet connectors (MetaMask, WalletConnect, Coinbase Wallet)
- ✅ Support for Mantle Network (Mainnet & Sepolia Testnet)
- ✅ Real-time balance display
- ✅ ENS name resolution
- ✅ Network switching
- ✅ Responsive wallet dropdown
- ✅ Copy address to clipboard
- ✅ View on block explorer
- ✅ Custom React hooks for wallet operations

## Setup

### 1. Install Dependencies

All required dependencies are already installed:

```bash
npm install wagmi viem @tanstack/react-query @wagmi/connectors @wagmi/core
```

### 2. Configure WalletConnect

Get your WalletConnect Project ID:
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Update the `.env.local` file with your Project ID:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. Configuration

The wagmi configuration is in `config.ts`:

- **Supported Networks**: Mantle, Mantle Sepolia, Ethereum Mainnet, Ethereum Sepolia
- **Connectors**: MetaMask (injected), WalletConnect, Coinbase Wallet
- **RPC URLs**: Public RPC endpoints (can be customized)

## Components

### ConnectWallet

Main wallet connection component with dropdown menu.

```tsx
import { ConnectWallet } from '@/components/connect-wallet'

export default function Page() {
  return <ConnectWallet />
}
```

**Features**:
- Connect wallet button with wallet selection
- Connected state showing address and balance
- Dropdown with:
  - Account details (address, balance, network)
  - Copy address
  - View on block explorer
  - Disconnect

### WalletInfo

Detailed wallet information card component.

```tsx
import { WalletInfo } from '@/components/wallet-info'

export default function Page() {
  return <WalletInfo />
}
```

**Displays**:
- Connection status
- Wallet address (formatted)
- ENS name (if available)
- Network name and Chain ID
- Balance with symbol

## Custom Hook

### useWallet

Reusable hook for wallet operations.

```tsx
import { useWallet } from '@/hooks/use-wallet'

export function MyComponent() {
  const {
    address,
    isConnected,
    chain,
    balance,
    ensName,
    formatAddress,
    formatBalance,
    copyAddressToClipboard,
    disconnect,
  } = useWallet()

  return (
    <div>
      {isConnected ? (
        <p>Connected: {formatAddress(address)}</p>
      ) : (
        <p>Not connected</p>
      )}
    </div>
  )
}
```

**Available properties**:
- `address` - Wallet address
- `isConnected` - Connection status
- `chain` - Current chain object
- `chainId` - Current chain ID
- `ensName` - ENS name (if available)
- `balance` - Balance object with value, decimals, symbol
- `isBalanceLoading` - Balance loading state
- `refetchBalance` - Function to refresh balance
- `disconnect` - Function to disconnect wallet
- `switchChain` - Function to switch networks
- `copyAddressToClipboard` - Copy address helper
- `formatAddress` - Address formatting helper
- `formatBalance` - Balance formatting helper
- `getExplorerUrl` - Get block explorer URL

## Provider Setup

The `Web3Provider` wraps your app in `layout.tsx`:

```tsx
import { Web3Provider } from '@/components/providers/web3-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
```

## Usage Example

Check out the example page at `/wallet` (`app/wallet/page.tsx`) for a complete demo.

Run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000/wallet](http://localhost:3000/wallet)

## Supported Networks

### Mantle Mainnet
- Chain ID: 5000
- RPC: https://rpc.mantle.xyz
- Explorer: https://explorer.mantle.xyz

### Mantle Sepolia (Testnet)
- Chain ID: 5003
- RPC: https://rpc.sepolia.mantle.xyz
- Explorer: https://explorer.sepolia.mantle.xyz

### Ethereum Mainnet
- Chain ID: 1

### Ethereum Sepolia (Testnet)
- Chain ID: 11155111

## Customization

### Add Custom Networks

Edit `config.ts`:

```typescript
export const customChain = {
  id: 123456,
  name: 'Custom Network',
  nativeCurrency: {
    decimals: 18,
    name: 'Token',
    symbol: 'TKN',
  },
  rpcUrls: {
    default: { http: ['https://rpc.custom.network'] },
    public: { http: ['https://rpc.custom.network'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.custom.network' },
  },
}

// Add to config
export const config = createConfig({
  chains: [customChain, mantle, mantleSepolia],
  // ...
})
```

### Styling

All components use Shadcn UI and are fully customizable with Tailwind CSS classes.

## Troubleshooting

### MetaMask not detected
- Ensure MetaMask extension is installed
- Refresh the page after installation

### WalletConnect not working
- Verify your Project ID is correct in `.env.local`
- Check that the Project ID is prefixed with `NEXT_PUBLIC_`

### Balance not showing
- Ensure you're connected to a supported network
- Check that the RPC endpoint is accessible
- Try refreshing the balance

### Network switching fails
- The wallet may not support the requested network
- Add the network to MetaMask manually first

## Best Practices

1. **Always check connection status** before performing blockchain operations
2. **Handle errors gracefully** - network issues, user rejections, etc.
3. **Show loading states** during async operations
4. **Validate user inputs** before transactions
5. **Test on testnets first** before mainnet deployment

## Resources

- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Mantle Network Docs](https://docs.mantle.xyz)
