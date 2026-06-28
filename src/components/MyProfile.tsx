import React from "react";
import MyProfileClient from "./MyProfileClient";

/**
 * MyProfile component following the Next.js "Server Components by Default" philosophy.
 * This component acts as a server-side entry point. For now, it renders the 
 * interactive client component which handles user profiling and account deletion.
 */
const MyProfile = () => {
  return <MyProfileClient />;
};

export default MyProfile;
