import React from "react";
import MyAddressClient from "./MyAddressClient";

/**
 * MyAddress component following the Next.js "Server Components by Default" philosophy.
 * This component acts as a server-side entry point, which can eventually be
 * used for server-side data fetching once suitable authentication (like cookies)
 * is implemented. For now, it renders the interactive client component.
 */
const MyAddress = () => {
  return <MyAddressClient />;
};

export default MyAddress;
