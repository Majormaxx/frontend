import Theme from "@/components/template/Theme";
import Layout from "@/components/layouts";
import appConfig from "@/configs/app.config";
import "./locales";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
import { createSiweMessage } from "viem/siwe";
import { getAccount } from "wagmi/actions";
import useAuth from "./utils/hooks/useAuth";
import { useEffect, useMemo } from "react";
import { mainnet, polygon, optimism, arbitrum, base, arbitrumSepolia, celo, celoAlfajores } from "wagmi/chains";
import { useAppSelector } from "./store";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomAvatar from "./components/collabberry/custom-components/CustomRainbowKit/CustomAvatar";
import { Env, environment } from "./api/environment";
import { mockServer } from "./mock/mock";



export const config = getDefaultConfig({
  appName: "Collabberry",
  projectId: "dd33813752fd2f608af1325845cc6abc",
  // syncConnectedChain: true,
  chains: environment?.env === Env.Production ? [arbitrum, celo] : [arbitrumSepolia, celo],
  // ssr: true, // If your dApp uses server side rendering (SSR)
});

/**
 * Set enableMock(Default false) to true at configs/app.config.js
 * If you wish to enable mock api
 */
if (environment?.env !== "production" && appConfig.enableMock) {
  mockServer({ environment: environment?.env });
}

// Use empty string for mock mode so URLs are relative, otherwise use full backend URL
const base_url = (environment?.env !== "production" && appConfig.enableMock) ? "" : environment?.apiUrl;

function App() {
  const { signInWithWallet } = useAuth();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const state = useAppSelector((state) => state);


  const avatarProps = useMemo(() => {
    const { profilePicture, userName } = user;
    return { ensImage: profilePicture, size: 50 };
  }, [user]);
  const [searchParams, setSearchParams] = useSearchParams();
  const invitationToken = useMemo(() => {
    return searchParams.get("invitationToken");
  }, [searchParams.get("invitationToken")]);
  const { status } = useAppSelector((state) => state.auth.session);

  const authenticationAdapter = useMemo(() => {
    return createAuthenticationAdapter({
      getNonce: async () => {
        try {
          const { address } = getAccount(config);
          const response = await fetch(`${base_url}/api/users/auth/nonce`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress: address }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseBody = await response.json();
          return responseBody?.nonce;
        } catch (error) {
          console.error("Error getting nonce:", error);
          throw error;
        }
      },
      createMessage: ({ nonce, address, chainId }) => {
        console.log('Creating SIWE message with:', { nonce, address, chainId });
        try {
          const message = createSiweMessage({
            domain: window.location.host,
            address: address as `0x${string}`,
            statement: "Sign in with Ethereum to CollabBerry.",
            uri: window.location.origin,
            version: "1",
            chainId,
            nonce,
          });
          console.log('Created SIWE message:', message);
          return message;
        } catch (error) {
          console.error('Error creating SIWE message:', error);
          throw error;
        }
      },
      getMessageBody: ({ message }) => {
        // With viem/siwe, message is already a string, so just return it
        return message;
      },
      verify: async ({ message, signature }) => {
        console.log('Verify called with:', { message, signature });
        try {
          const verifyRes = await fetch(`${base_url}/api/users/auth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ signature, message }),
          });

          if (!verifyRes.ok) {
            console.error("Verify response not ok:", verifyRes.status, verifyRes.statusText);
            return false;
          }

          const responseData = await verifyRes.json();
          const { token } = responseData;

          if (!token) {
            console.error("No token received from verify endpoint");
            return false;
          }

          const result = await signInWithWallet(token);
          if (result?.status === "success") {
            return true;
          } else {
            const url = invitationToken
              ? `${appConfig.memberSignUpPath}?invitationToken=${invitationToken}`
              : appConfig.notRegisteredEntryPath;
            navigate(url);
            return false;
          }
        } catch (error) {
          console.error("Error verifying signature", error);
          return false;
        }
      },
      signOut: async () => {},
    });
  }, []);

  //TODO: Enable this for debugging

  useEffect(() => {
    console.log("Auth state changed:", state.auth);
    console.log("Current status for RainbowKit:", status);
  }, [state.auth, status]);

  return (
    <RainbowKitAuthenticationProvider
      adapter={authenticationAdapter}
      status={status}
    >
      <RainbowKitProvider
        appInfo={{
          appName: "Collabberry",
          learnMoreUrl: environment?.appUrl
        }}
        avatar={CustomAvatar}
      >
        <Theme>
          <Layout />
        </Theme>
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  );
}

export default App;
