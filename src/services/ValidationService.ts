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

export const isContract = async (
    address: string,
    chainId: number
): Promise<boolean> => {
    if (!ethers.isAddress(address) || !chainId) {
        return false
    }

    try {
        const provider = getProvider(chainId)
        const code = await provider.getCode(address)
        return code !== '0x'
    } catch (error) {
        console.error('Error checking contract:', error)
        return false
    }
}

export const hasMinterRole = async (
    address: string,
    recognitionTokenAddress: string,
    chainId: number
): Promise<boolean> => {
    if (
        !ethers.isAddress(address) ||
        !ethers.isAddress(recognitionTokenAddress) ||
        !chainId
    ) {
        return false
    }

    try {
        const provider = getProvider(chainId)
        const recognitionTokenContract = new ethers.Contract(
            recognitionTokenAddress,
            TeamPointsABI.abi,
            provider
        )
        const MINTER_ROLE = ethers.id('MINTER_ROLE')
        const hasRole = await recognitionTokenContract.hasRole(MINTER_ROLE, address)
        return hasRole
    } catch (error) {
        console.error('Error checking minter role:', error)
        return false
    }
}

export const hasAdminRole = async (
    address: string,
    recognitionTokenAddress: string,
    chainId: number
): Promise<boolean> => {
    if (
        !ethers.isAddress(address) ||
        !ethers.isAddress(recognitionTokenAddress) ||
        !chainId
    ) {
        return false
    }

    try {
        const provider = getProvider(chainId)
        const recognitionTokenContract = new ethers.Contract(
            recognitionTokenAddress,
            TeamPointsABI.abi,
            provider
        )
        const ADMIN_ROLE = ethers.id('ADMIN_ROLE')
        const hasRole = await recognitionTokenContract.hasRole(ADMIN_ROLE, address)
        return hasRole
    } catch (error) {
        console.error('Error checking admin role:', error)
        return false
    }
}