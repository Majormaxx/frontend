import { ethers } from 'ethers'

const getProvider = (chainId: number) => {
    if (chainId === 11155111) { // Sepolia
        return new ethers.JsonRpcProvider(import.meta.env.VITE_APP_ARBITRUM_SEPOLIA_RPC);
    }
    if (chainId === 42161) { // Arbitrum
        return new ethers.JsonRpcProvider(import.meta.env.VITE_APP_ARBITRUM_RPC);
    }
    // Fallback to mainnet - though we should have a value for it
    return new ethers.JsonRpcProvider(import.meta.env.VITE_APP_MAINNET_RPC);
};


export const isContract = async (address: string, chainId: number): Promise<boolean> => {
    if (!ethers.isAddress(address) || !chainId) {
        return false;
    }

    try {
        const provider = getProvider(chainId);
        const code = await provider.getCode(address)
        return code !== '0x'
    } catch (error) {
        console.error('Error checking contract:', error)
        return false
    }
}