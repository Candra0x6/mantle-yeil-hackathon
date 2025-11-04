import { mantle, mantleSepolia, localhost } from '@/config'

export interface ContractAddresses {
  yeil: `0x${string}`
  proofOfReserveFeed: `0x${string}`
}

// Contract addresses for each network
export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  // Localhost (Anvil)
  [localhost.id]: {
    yeil: '0xA15BB66138824a1c7167f5E85b957d04Dd34E468', // Deployed Yeil Token
    proofOfReserveFeed: '0x700b6A60ce7EaaEA56F065753d8dcB9653dbAD35', // Deployed ProofOfReserveFeed
  },
  // Mantle Mainnet
  [mantle.id]: {
    yeil: '0x0000000000000000000000000000000000000000', // Replace with deployed address
    proofOfReserveFeed: '0x0000000000000000000000000000000000000000', // Replace with deployed address
  },
  // Mantle Sepolia Testnet
  [mantleSepolia.id]: {
    yeil: '0x0000000000000000000000000000000000000000', // Replace with deployed address
    proofOfReserveFeed: '0x0000000000000000000000000000000000000000', // Replace with deployed address
  },
}

// Helper function to get contract address for current chain
export function getContractAddress(
  chainId: number | undefined,
  contract: keyof ContractAddresses
): `0x${string}` | undefined {
  if (!chainId || !CONTRACT_ADDRESSES[chainId]) return undefined
  return CONTRACT_ADDRESSES[chainId][contract]
}

// Type-safe contract address getter
export function getYeilAddress(chainId: number | undefined): `0x${string}` | undefined {
  return getContractAddress(chainId, 'yeil')
}

export function getProofOfReserveFeedAddress(chainId: number | undefined): `0x${string}` | undefined {
  return getContractAddress(chainId, 'proofOfReserveFeed')
}
