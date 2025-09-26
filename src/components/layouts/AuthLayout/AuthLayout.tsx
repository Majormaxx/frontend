
import View from "@/views";
import { useAppSelector } from "@/store";
import Header from "@/components/template/Header";
import CollabberyLogoFull from "@/assets/svg/CollabberryLogoFull";
import { DisconnectButton } from "@/components/collabberry/custom-components/CustomRainbowKit/UserDisconnect";
import { CustomWrongNetworkButton } from "@/components/collabberry/custom-components/CustomRainbowKit/CustomWrongNetworkButton";

const AuthHeaderActionEnd = () => {
  return (
    <>
      <CustomWrongNetworkButton />
      <DisconnectButton />
    </>
  );
};

const AuthLayout = () => {
  const layoutType = useAppSelector((state) => state.theme.layout.type);

  return (
    <div className="relative flex min-h-screen w-full min-w-0 flex-auto flex-col">
      <Header
        className="bg-transparent shadow-none backdrop-blur-md"
        headerStart={<CollabberyLogoFull />}
        headerEnd={<AuthHeaderActionEnd />}
      />
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center">
        <View />
      </div>
    </div>
  );
};

export default AuthLayout;
