import Header from "@/components/template/Header";
import SidePanel from "@/components/template/SidePanel";
import UserDropdown from "@/components/template/UserDropdown";
import SideNavToggle from "@/components/template/SideNavToggle";
import MobileNav from "@/components/template/MobileNav";
import SideNav from "@/components/template/SideNav";
import View from "@/views";
import { CustomConnectButton } from "../collabberry/custom-components/CustomRainbowKit/CustomConnectButton";
import UserAccount from "../collabberry/custom-components/CustomRainbowKit/UserAccount";

const HeaderActionsStart = () => {
  return (
    <>
      <MobileNav />
      <SideNavToggle />
    </>
  );
};

const HeaderActionsEnd = () => {
  return (
    <>
      <UserAccount />
    </>
  );
};

const ModernLayout = () => {
  return (
    <div className="app-layout-modern flex flex-auto flex-col">
      <div className="flex min-w-0 flex-auto">
        <SideNav />
        <div className="relative flex min-h-screen w-full min-w-0 flex-auto flex-col border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Header
            className="border-b border-gray-200 dark:border-gray-700"
            headerEnd={<HeaderActionsEnd />}
            headerStart={<HeaderActionsStart />}
          />
          <View />
        </div>
      </div>
    </div>
  );
};

export default ModernLayout;
