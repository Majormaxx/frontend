import { envionmentGenerator } from "@/utils/environmentGenerator";

export enum Env {
    Production = "production",
    Development = "development"
}

export const envVariables = {
    env: "VITE_NODE_ENV",
    apiUrl: "VITE_APP_BASE_URL",
    teamPointsFactoryAddress: "VITE_APP_TEAM_POINTS_FACTORY_ADDRESS",
    teamPointsFactoryAddressCelo: "VITE_APP_TEAM_POINTS_FACTORY_ADDRESS_CELO",
    rainbowProjectId: "VITE_APP_RAINBOW_PROJECT_ID",
    walletConnectProjectId: "VITE_APP_WALLETCONNECT_PROJECT_ID",
    arbitrumSepoliaRpc: "VITE_APP_ARBITRUM_SEPOLIA_RPC",
    celoAlfajoresRpc: "VITE_APP_CELO_ALFAJORES_RPC",
    appUrl: "VITE_APP_URL",
    network: "VITE_APP_NETWORK",
    blockExplorer: "VITE_APP_BLOCK_EXPLORER"

};

export const environment: typeof envVariables =
    envionmentGenerator(envVariables);