import React from "react";
import SearchDropdownClient from "./SearchDropdownClient";

interface SearchDropdownProps {
  onClose?: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ onClose }) => {
  return <SearchDropdownClient onClose={onClose} />;
};

export default SearchDropdown;
