# 🎯 Yeil Contract Frontend Integration - Complete Guide

## ✅ What's Been Implemented

### 1. **Type-Safe Contract ABI** (`lib/contracts/yeil-abi.ts`)
- ✅ Complete ABI with all functions, events, and errors
- ✅ TypeScript `as const` assertion for type inference
- ✅ Full compatibility with Wagmi v2 and Viem

### 2. **Contract Address Management** (`lib/contracts/addresses.ts`)
- ✅ Multi-network support (Mantle Mainnet & Sepolia)
- ✅ Type-safe address getters
- ✅ Easy deployment address updates

### 3. **Comprehensive Hooks** (`hooks/use-yeil-contract.ts`)
- ✅ 10+ custom hooks for contract interaction
- ✅ Automatic type inference
- ✅ Transaction state management
- ✅ Auto-refresh on transaction success

### 4. **Complete Dashboard** (`app/yeil/page.tsx`)
- ✅ Token balance display
- ✅ Transfer interface
- ✅ Snapshot viewer
- ✅ Token information panel
- ✅ Real-time updates

## 🚀 Quick Start

### Step 1: Deploy Your Contract

Deploy the Yeil contract to Mantle Sepolia testnet:

```bash
cd contracts
forge script script/DeployYeil.s.sol --rpc-url $MANTLE_SEPOLIA_RPC --broadcast
```

### Step 2: Update Contract Addresses

Edit `frontend/lib/contracts/addresses.ts`:

```typescript
export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  [mantleSepolia.id]: {
    yeil: '0xYOUR_DEPLOYED_ADDRESS_HERE',
    proofOfReserveFeed: '0xYOUR_ORACLE_ADDRESS_HERE',
  },
}
```

### Step 3: Run the Frontend

```bash
cd frontend
npm run dev
```

### Step 4: Test the Integration

Visit: http://localhost:3000/yeil

## 📚 Available Hooks

### Read Hooks (No Gas Required)

```typescript
// Get complete token info
const { tokenInfo, isLoading, refetch } = useYeilTokenInfo()

// Get user balance
const { balance, isLoading, refetch } = useYeilBalance(address)

// Get balance at snapshot
const { balance, balanceFormatted } = useYeilBalanceAt(address, snapshotId)

// Get total supply at snapshot
const { totalSupply, totalSupplyFormatted } = useYeilTotalSupplyAt(snapshotId)

// Check allowance
const { allowance, allowanceFormatted } = useYeilAllowance(owner, spender)
```

### Write Hooks (Require Gas & Wallet Signature)

```typescript
// Transfer tokens
const { transfer, isPending, isSuccess, error } = useYeilTransfer()
await transfer('0xRecipient...', '10.5')

// Mint tokens (owner only)
const { mint, isPending, isSuccess } = useYeilMint()
await mint('0xRecipient...', '100')

// Burn tokens (owner only)
const { burn, isPending, isSuccess } = useYeilBurn()
await burn('0xAddress...', '50')

// Approve spending
const { approve, isPending, isSuccess } = useYeilApprove()
await approve('0xSpender...', '1000')

// Create snapshot (owner only)
const { createSnapshot, isPending, isSuccess } = useYeilSnapshot()
await createSnapshot()
```

### Comprehensive Hook

```typescript
const {
  contractAddress,
  tokenInfo,
  balance,
  transfer,
  mint,
  burn,
  approve,
  createSnapshot,
  transferState,
  mintState,
  refetch,
} = useYeilContract()
```

## 💡 Usage Examples

### Display Token Balance

```typescript
'use client'

import { useYeilBalance, useYeilTokenInfo } from '@/hooks/use-yeil-contract'
import { useAccount } from 'wagmi'

export function MyBalance() {
  const { address } = useAccount()
  const { tokenInfo } = useYeilTokenInfo()
  const { balance } = useYeilBalance(address)

  return (
    <div>
      <p>Balance: {balance?.balanceFormatted} {tokenInfo?.symbol}</p>
    </div>
  )
}
```

### Transfer Tokens

```typescript
'use client'

import { useState } from 'react'
import { useYeilTransfer } from '@/hooks/use-yeil-contract'

export function TransferButton() {
  const { transfer, isPending, isSuccess } = useYeilTransfer()
  
  const handleTransfer = async () => {
    await transfer('0xRecipient...', '10')
  }

  return (
    <button onClick={handleTransfer} disabled={isPending}>
      {isPending ? 'Transferring...' : 'Transfer'}
    </button>
  )
}
```

### Check Reserve Backing

```typescript
'use client'

import { useYeilTokenInfo } from '@/hooks/use-yeil-contract'

export function BackingStatus() {
  const { tokenInfo } = useYeilTokenInfo()

  return (
    <div>
      <p>Status: {tokenInfo?.isFullyBacked ? '✅ Fully Backed' : '⚠️ Under-collateralized'}</p>
      <p>Reserves: {tokenInfo?.verifiedReserves.toString()}</p>
      <p>Supply: {tokenInfo?.totalSupply.toString()}</p>
    </div>
  )
}
```

## 🔧 Configuration Files

### TypeScript Config
- ✅ Updated to ES2020 for BigInt support
- ✅ Strict mode enabled
- ✅ Path aliases configured

### Contract Addresses
Update these after deployment:
- Yeil token contract
- ProofOfReserveFeed oracle

## 🎨 UI Components

The dashboard includes:

1. **Overview Cards**
   - Your balance
   - Total supply
   - Verified reserves
   - Backing status

2. **Transfer Tab**
   - Send tokens to any address
   - Transaction status tracking
   - Error handling

3. **Snapshot Tab**
   - View historical balances
   - Create new snapshots
   - Snapshot-based queries

4. **Info Tab**
   - Contract details
   - Token information
   - Refresh data

## 🔒 Type Safety Features

### 1. Compile-Time Checks
```typescript
// ✅ TypeScript validates function calls
await transfer('0x123...', '10')

// ❌ TypeScript error
await transfer(123, true)
```

### 2. Autocomplete
Your IDE provides autocomplete for:
- Function names
- Parameters
- Return types

### 3. Type Inference
```typescript
const { tokenInfo } = useYeilTokenInfo()
// tokenInfo is automatically typed!

tokenInfo?.name       // string
tokenInfo?.decimals   // number
tokenInfo?.totalSupply // bigint
```

## 📊 Contract Functions

### ERC20 Standard
- `transfer(to, amount)` - Transfer tokens
- `approve(spender, amount)` - Approve spending
- `transferFrom(from, to, amount)` - Transfer from approved
- `balanceOf(account)` - Get balance
- `allowance(owner, spender)` - Check allowance

### Yeil Specific
- `mint(to, amount)` - Mint tokens (owner)
- `burn(from, amount)` - Burn tokens (owner)
- `snapshot()` - Create snapshot (owner)
- `balanceOfAt(account, snapshotId)` - Historical balance
- `totalSupplyAt(snapshotId)` - Historical supply
- `getVerifiedReserves()` - Get reserves
- `isFullyBacked()` - Check backing status

## 🚨 Important Notes

### Before Production

1. **Deploy Contracts**
   - Deploy Yeil contract
   - Deploy ProofOfReserveFeed oracle
   - Verify contracts on explorer

2. **Update Addresses**
   - Update `lib/contracts/addresses.ts`
   - Test on testnet first
   - Double-check addresses

3. **Security**
   - Audit smart contracts
   - Test all functions
   - Verify owner-only functions

4. **Testing**
   - Test all read functions
   - Test all write functions
   - Test error cases
   - Test transaction flow

## 📖 Additional Documentation

- [WALLET_SETUP.md](./WALLET_SETUP.md) - Wallet connection guide
- [CONTRACT_INTEGRATION.md](./CONTRACT_INTEGRATION.md) - Detailed integration docs
- [INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md) - Integration summary

## 🛠️ Troubleshooting

### "Contract address not found"
- Ensure contract is deployed
- Update addresses in `lib/contracts/addresses.ts`
- Check you're on the correct network

### "Transaction failed"
- Check wallet has enough gas
- Verify you have permission (for owner functions)
- Check contract is not paused

### "Balance not updating"
- Call `refetch()` after transactions
- Wait for transaction confirmation
- Check network connection

### TypeScript errors with BigInt
- Ensure `tsconfig.json` has `target: "ES2020"`
- Restart TypeScript server in VS Code

## 🎯 Best Practices

1. **Always check connection**
   ```typescript
   if (!isConnected) return <ConnectWallet />
   ```

2. **Handle loading states**
   ```typescript
   if (isLoading) return <Spinner />
   ```

3. **Show transaction status**
   ```typescript
   {isPending && <p>Confirming...</p>}
   {isSuccess && <p>Success!</p>}
   ```

4. **Display errors**
   ```typescript
   {error && <Alert>{error.message}</Alert>}
   ```

5. **Auto-refresh data**
   ```typescript
   useEffect(() => {
     if (isSuccess) refetch()
   }, [isSuccess, refetch])
   ```

## 🌟 Features

✅ Full TypeScript type safety
✅ Automatic type inference
✅ Transaction state management
✅ Error handling
✅ Loading states
✅ Auto-refresh on success
✅ Multi-network support
✅ Responsive UI
✅ Comprehensive documentation
✅ Production-ready code

---

**Need help?** Check the detailed documentation in `CONTRACT_INTEGRATION.md`

**Ready to deploy!** 🚀
