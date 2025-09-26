import { ethers } from 'ethers'
import TeamPointsABI from '../abi/TeamPoints.json'

const getProvider = (chainId: number) => {
    if (chainId === 11155111) {
        // Sepolia
        return new ethers.JsonRpcProvider(
            import.meta.env.VITE_APP_ARBITRUM_SEPOLIA_RPC
        )
    }
    if (chainId === 42161) {
        // Arbitrum
        return new ethers.JsonRpcProvider(import.meta.env.VITE_APP_ARBITRUM_RPC)
    }
    // Fallback to mainnet - though we should have a value for it
    return new ethers.JsonRpcProvider(import.meta.env.VITE_APP_MAINNET_RPC)
}