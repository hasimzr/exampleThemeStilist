import React from "react";
import MyFavoritesClient from "./MyFavoritesClient";

/**
 * MyFavorites component following the Next.js "Server Components by Default" philosophy.
 * This component acts as a server-side entry point that renders the interactive client component.
 * In the future, initial data fetching can be moved here if server-side auth is ready.
 */
const MyFavorites = () => {
  return <MyFavoritesClient />;
};

export default MyFavorites;
