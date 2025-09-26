import classNames from "classnames";
import Container from "@/components/shared/Container";
import { APP_NAME } from "@/constants/app.constant";
import { PAGE_CONTAINER_GUTTER_X } from "@/constants/theme.constant";
import { Dialog } from "../ui";
import PrivacyPolicy from "../collabberry/PrivacyPolicy";
import { useState } from "react";
import TermsAndConditions from "../collabberry/TermsAndConditions";

export type FooterPageContainerType = "gutterless" | "contained";

type FooterProps = {
  pageContainerType: FooterPageContainerType;
};

const FooterContent = () => {
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const openPrivacyPolicy = () => setIsPrivacyPolicyOpen(true);
  const closePrivacyPolicy = () => setIsPrivacyPolicyOpen(false);
  const [isTermsAndConditionsOpen, setIsTermsAndConditionsOpen] =
    useState(false);
  const openTermsAndConditions = () => setIsTermsAndConditionsOpen(true);
  const closeTermsAndConditions = () => setIsTermsAndConditionsOpen(false);
  return (
    <div className="flex w-full flex-auto items-center justify-between">
      {isPrivacyPolicyOpen && (
        <Dialog onClose={closePrivacyPolicy} isOpen={isPrivacyPolicyOpen}>
          <PrivacyPolicy />
        </Dialog>
      )}
      {isTermsAndConditionsOpen && (
        <Dialog
          onClose={closeTermsAndConditions}
          isOpen={isTermsAndConditionsOpen}
        >
          <Container>
            <TermsAndConditions />
          </Container>
        </Dialog>
      )}
      <span>
        Copyright &copy; {`${new Date().getFullYear()}`}{" "}
        <span className="font-semibold">{`${APP_NAME}`}</span> All rights
        reserved.
      </span>
      <div className="">
        <a
          className="text-gray"
          href="/#"
          onClick={(e) => {
            e.preventDefault();
            openTermsAndConditions();
          }}
        >
          Terms & Conditions
        </a>
        <span className="text-muted mx-2"> | </span>
        <a
          className="text-gray"
          href="/#"
          onClick={(e) => {
            e.preventDefault();
            openPrivacyPolicy();
          }}
        >
          Privacy & Policy
        </a>
      </div>
    </div>
  );
};

export default function Footer({
  pageContainerType = "contained",
}: FooterProps) {
  return (
    <footer
      className={classNames(
        `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`
      )}
    >
      {pageContainerType === "contained" ? (
        <Container>
          <FooterContent />
        </Container>
      ) : (
        <FooterContent />
      )}
    </footer>
  );
}
