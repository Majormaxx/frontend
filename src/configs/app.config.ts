import { environment } from "@/api/environment";

export type AppConfig = {
  apiPrefix: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  inviteEntryPath: string;
  notRegisteredEntryPath: string;
  memberSignUpPath: string;
  tourPath: string;
  locale: string;
  enableMock: boolean;
};

// Define enableMock first so we can use it in apiPrefix
const enableMock = true;

const appConfig: AppConfig = {
  // Use relative path for mocks so MirageJS can intercept requests
  // Use full URL for production backend
  apiPrefix: enableMock ? "/api" : `${environment.apiUrl}/api`,
  authenticatedEntryPath: "/dashboard",
  unAuthenticatedEntryPath: "/sign-in",
  notRegisteredEntryPath: "/sign-up",
  inviteEntryPath: "/invite",
  memberSignUpPath: "/member-sign-up",
  tourPath: "/",
  locale: "en",
  enableMock,
};

export default appConfig;
