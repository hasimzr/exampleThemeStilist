import React from "react";
import LoginOrUserDataEntryClient, {
  type GuestInfo,
  type LoginOrUserDataEntryProps,
} from "./LoginOrUserDataEntryClient";

/**
 * LoginOrUserDataEntry component following "Server Components by Default" philosophy.
 * It stays as a thin wrapper that could potentially handle server-side data fetching
 * or session checks if needed in the future.
 */
const LoginOrUserDataEntry = (props: LoginOrUserDataEntryProps) => {
  return <LoginOrUserDataEntryClient {...props} />;
};

export default LoginOrUserDataEntry;
