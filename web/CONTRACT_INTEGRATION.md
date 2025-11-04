# Yeil Contract Integration - Type-Safe Implementation

Complete TypeScript integration with the Yeil smart contract using Wagmi v2 and Viem.

## 📁 File Structure

```
frontend/
├── lib/
│   └── contracts/
│       ├── yeil-abi.ts          # Complete typed ABI
│       └── addresses.ts          # Network-specific contract addresses
├── hooks/
│   └── use-yeil-contract.ts     # Custom hooks for contract interaction
└── app/
    └── yeil/
        └── page.tsx             # Complete dashboard UI
```

## 🔧 Configuration

### 1. Contract ABI (`lib/contracts/yeil-abi.ts`)

Complete ABI with TypeScript type safety using `as const` assertion.

**Features:**
- ✅ All contract functions (read & write)
- ✅ Events with indexed parameters
- ✅ Custom errors
- ✅ Full type inference with Wagmi

### 2. Contract Addresses (`lib/contracts/addresses.ts`)

Multi-network configuration with type-safe address management.

```typescript
// Update after deployment
export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  [mantle.id]: {
    yeil: '0xYourDeployedAddress',
    proofOfReserveFeed: '0xYourOracleAddress',
  },
  [mantleSepolia.id]: {
    yeil: '0xYourTestnetAddress',
    proofOfReserveFeed: '0xYourTestnetOracleAddress',
  },
}
```

## 🎣 Custom Hooks

### Core Hook: `useYeilContract()`

Comprehensive hook combining all contract functionality.

```typescript
const {
  // Contract info
  contractAddress,
  tokenInfo,
  balance,
  isLoading,
  
  // Actions
  transfer,
  mint,
  burn,
  approve,
  createSnapshot,
  
  // Transaction states
  transferState,
  mintState,
  burnState,
  approveState,
  snapshotState,
  
  // Utils
  refetch,
} = useYeilContract()
```

### Read Hooks

#### `useYeilTokenInfo()`
Get complete token information:
```typescript
const { tokenInfo, isLoading, refetch } = useYeilTokenInfo()

// Returns:
interface YeilTokenInfo {
  name: string
  symbol: string
  decimals: number
  totalSupply: bigint
  verifiedReserves: bigint
  isFullyBacked: boolean
  proofOfReserveFeedAddress: `0x${string}`
}
```

#### `useYeilBalance(address)`
Get user's token balance:
```typescript
const { balance, isLoading, refetch } = useYeilBalance(userAddress)

// Returns:
interface YeilBalance {
  balance: bigint
  balanceFormatted: string  // In ether units
}
```

#### `useYeilBalanceAt(address, snapshotId)`
Get balance at a specific snapshot:
```typescript
const { balance, balanceFormatted, isLoading } = useYeilBalanceAt(address, 5)
```

#### `useYeilTotalSupplyAt(snapshotId)`
Get total supply at a specific snapshot:
```typescript
const { totalSupply, totalSupplyFormatted, isLoading } = useYeilTotalSupplyAt(5)
```

#### `useYeilAllowance(owner, spender)`
Check ERC20 allowance:
```typescript
const { allowance, allowanceFormatted, isLoading, refetch } = useYeilAllowance(owner, spender)
```

### Write Hooks

#### `useYeilTransfer()`
Transfer tokens:
```typescript
const { transfer, hash, isPending, isConfirming, isSuccess, error } = useYeilTransfer()

// Usage
await transfer('0xRecipient...', '10.5')  // Amount in ether
```

#### `useYeilMint()` (Owner Only)
Mint new tokens:
```typescript
const { mint, hash, isPending, isConfirming, isSuccess, error } = useYeilMint()

// Usage
await mint('0xRecipient...', '100')  // Amount in ether
```

#### `useYeilBurn()` (Owner Only)
Burn tokens:
```typescript
const { burn, hash, isPending, isConfirming, isSuccess, error } = useYeilBurn()

// Usage
await burn('0xAddress...', '50')  // Amount in ether
```

#### `useYeilApprove()`
Approve spending:
```typescript
const { approve, hash, isPending, isConfirming, isSuccess, error } = useYeilApprove()

// Usage
await approve('0xSpender...', '1000')  // Amount in ether
```

#### `useYeilSnapshot()` (Owner Only)
Create a new snapshot:
```typescript
const { createSnapshot, hash, isPending, isConfirming, isSuccess, error } = useYeilSnapshot()

// Usage
await createSnapshot()
```

## 💡 Usage Examples

### Basic Token Display

```typescript
'use client'

import { useYeilTokenInfo, useYeilBalance } from '@/hooks/use-yeil-contract'
import { useAccount } from 'wagmi'

export function TokenBalance() {
  const { address } = useAccount()
  const { tokenInfo } = useYeilTokenInfo()
  const { balance } = useYeilBalance(address)

  return (
    <div>
      <h2>{tokenInfo?.name} ({tokenInfo?.symbol})</h2>
      <p>Your Balance: {balance?.balanceFormatted} {tokenInfo?.symbol}</p>
      <p>Total Supply: {tokenInfo?.totalSupply.toString()}</p>
      <p>Reserves: {tokenInfo?.verifiedReserves.toString()}</p>
      <p>Status: {tokenInfo?.isFullyBacked ? '✅ Fully Backed' : '⚠️ Under-collateralized'}</p>
    </div>
  )
}
```

### Transfer Tokens

```typescript
'use client'

import { useState } from 'react'
import { useYeilTransfer } from '@/hooks/use-yeil-contract'

export function TransferForm() {
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const { transfer, isPending, isSuccess, error } = useYeilTransfer()

  const handleTransfer = async () => {
    try {
      await transfer(to as `0x${string}`, amount)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <input 
        value={to} 
        onChange={(e) => setTo(e.target.value)} 
        placeholder="Recipient address"
      />
      <input 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
        placeholder="Amount"
      />
      <button onClick={handleTransfer} disabled={isPending}>
        {isPending ? 'Transferring...' : 'Transfer'}
      </button>
      {isSuccess && <p>✅ Transfer successful!</p>}
      {error && <p>❌ Error: {error.message}</p>}
    </div>
  )
}
```

### Check Backing Status

```typescript
'use client'

import { useYeilTokenInfo } from '@/hooks/use-yeil-contract'
import { formatEther } from 'viem'

export function BackingStatus() {
  const { tokenInfo, isLoading } = useYeilTokenInfo()

  if (isLoading) return <div>Loading...</div>

  const backingRatio = tokenInfo?.totalSupply && tokenInfo?.verifiedReserves
    ? (Number(tokenInfo.verifiedReserves) / Number(tokenInfo.totalSupply)) * 100
    : 0

  return (
    <div>
      <h3>Reserve Backing Status</h3>
      <p>Total Supply: {formatEther(tokenInfo?.totalSupply || 0n)}</p>
      <p>Verified Reserves: {formatEther(tokenInfo?.verifiedReserves || 0n)}</p>
      <p>Backing Ratio: {backingRatio.toFixed(2)}%</p>
      <p>
        Status: {tokenInfo?.isFullyBacked 
          ? '✅ Fully Backed' 
          : '⚠️ Needs More Reserves'}
      </p>
    </div>
  )
}
```

### Snapshot Viewer

```typescript
'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useYeilBalanceAt, useYeilTotalSupplyAt } from '@/hooks/use-yeil-contract'
import { formatEther } from 'viem'

export function SnapshotViewer() {
  const { address } = useAccount()
  const [snapshotId, setSnapshotId] = useState(0)
  
  const { balance } = useYeilBalanceAt(address, snapshotId)
  const { totalSupply } = useYeilTotalSupplyAt(snapshotId)

  return (
    <div>
      <input
        type="number"
        value={snapshotId}
        onChange={(e) => setSnapshotId(parseInt(e.target.value))}
        placeholder="Snapshot ID"
      />
      <div>
        <p>Your Balance at Snapshot #{snapshotId}: {formatEther(balance)}</p>
        <p>Total Supply at Snapshot: {formatEther(totalSupply)}</p>
      </div>
    </div>
  )
}
```

## 🎨 Complete Dashboard

A fully-featured dashboard is available at `/yeil` with:

- ✅ Real-time balance display
- ✅ Total supply & reserves
- ✅ Backing status indicator
- ✅ Token transfer interface
- ✅ Snapshot history viewer
- ✅ Token information panel
- ✅ Transaction status tracking
- ✅ Error handling & loading states

Visit: http://localhost:3000/yeil

## 🔒 Type Safety Benefits

### 1. **Compile-Time Validation**
```typescript
// ✅ Correct usage
await transfer('0x123...', '10.5')

// ❌ TypeScript error - wrong types
await transfer(123, true)
```

### 2. **Autocomplete Support**
Your IDE will provide autocomplete for:
- Contract function names
- Function parameters
- Return types
- Event names

### 3. **Return Type Inference**
```typescript
const { tokenInfo } = useYeilTokenInfo()
// tokenInfo is automatically typed as YeilTokenInfo | undefined

tokenInfo?.name  // ✅ TypeScript knows this is a string
tokenInfo?.totalSupply  // ✅ TypeScript knows this is bigint
```

### 4. **Error Prevention**
```typescript
// TypeScript prevents invalid addresses
const address: `0x${string}` = '0x123'  // ✅ Valid
const address: `0x${string}` = 'invalid'  // ❌ Type error
```

## 🚀 Deployment Checklist

- [ ] Deploy Yeil contract on Mantle/Mantle Sepolia
- [ ] Deploy ProofOfReserveFeed oracle
- [ ] Update contract addresses in `lib/contracts/addresses.ts`
- [ ] Test all read functions
- [ ] Test all write functions (mint, burn, transfer)
- [ ] Test snapshot functionality
- [ ] Verify reserve backing calculations
- [ ] Test on testnet before mainnet
- [ ] Update environment variables if needed

## 🔄 Transaction Flow

### Read Operations (No Gas)
1. Hook calls `useReadContract`
2. Wagmi fetches data from blockchain
3. Data is cached automatically
4. Component receives typed data

### Write Operations (Requires Gas)
1. User triggers action (e.g., transfer)
2. Hook calls `useWriteContract`
3. Wallet prompts for confirmation
4. Transaction is sent
5. `useWaitForTransactionReceipt` tracks status
6. Data is auto-refreshed on success

## 📊 Contract Functions Reference

### Read Functions
- `name()` - Token name
- `symbol()` - Token symbol
- `decimals()` - Token decimals
- `totalSupply()` - Current total supply
- `balanceOf(address)` - Balance of address
- `balanceOfAt(address, snapshotId)` - Balance at snapshot
- `totalSupplyAt(snapshotId)` - Supply at snapshot
- `getVerifiedReserves()` - Current reserves
- `isFullyBacked()` - Backing status
- `allowance(owner, spender)` - ERC20 allowance
- `getTokenName()` - Token name (helper)
- `getTokenSymbol()` - Token symbol (helper)
- `getBalance(address)` - Balance (helper)
- `getProofOfReserveAddress()` - Oracle address

### Write Functions
- `transfer(to, amount)` - Transfer tokens
- `approve(spender, amount)` - Approve spending
- `transferFrom(from, to, amount)` - Transfer from approved address
- `mint(to, amount)` - Mint new tokens (owner only)
- `burn(from, amount)` - Burn tokens (owner only)
- `snapshot()` - Create snapshot (owner only)

### Events
- `Transfer(from, to, amount)` - Token transfer
- `Approval(owner, spender, amount)` - Approval granted
- `ERC20SnapshotCheckpointed(snapshotId)` - Snapshot created

## 🛠️ Best Practices

1. **Always check connection status**
   ```typescript
   const { isConnected } = useAccount()
   if (!isConnected) return <ConnectWallet />
   ```

2. **Handle loading states**
   ```typescript
   const { data, isLoading } = useYeilBalance(address)
   if (isLoading) return <Spinner />
   ```

3. **Show transaction status**
   ```typescript
   if (isPending) return 'Confirming...'
   if (isConfirming) return 'Processing...'
   if (isSuccess) return 'Success!'
   ```

4. **Display errors properly**
   ```typescript
   {error && <Alert>{error.message}</Alert>}
   ```

5. **Refresh data after transactions**
   ```typescript
   useEffect(() => {
     if (isSuccess) refetch()
   }, [isSuccess, refetch])
   ```

## 📚 Resources

- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ERC20 Standard](https://eips.ethereum.org/EIPS/eip-20)
- [ERC20Votes Extension](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Votes)

---

**✨ You now have a fully type-safe, production-ready contract integration!**
