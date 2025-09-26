import { ConnectButton } from "@rainbow-me/rainbowkit";

interface CustomConnectButtonProps {
  disabled?: boolean;
  imageUrl?: string;
  signInMode?: boolean;
  userName?: string;
}
export const CustomWrongNetworkButton: React.FC<CustomConnectButtonProps> = ({
}) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {

              if (connected && chain && chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className="button radius-round h-9 bg-transparent px-3 py-2 text-sm text-red-500">
                    Wrong network
                  </button>
                );
              }

            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
