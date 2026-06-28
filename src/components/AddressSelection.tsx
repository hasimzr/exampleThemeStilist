import React from "react";
import AddressSelectionClient from "./AddressSelectionClient";
import type { Address } from "../types";

// Note: AddressSelection can be used as a Server Component in Server-side pages
// or directly as AddressSelectionClient in Client-side flows like CartClient.

interface AddressSelectionProps {
  onComplete: (selectedAddress: Address) => void;
  orderData?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  };
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  selectedAddress: Address | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
  initialAddresses?: Address[];
}

/**
 * AddressSelection component following "Server Components by Default" philosophy.
 * It stays as a thin wrapper that could potentially fetch data on the server side
 * if the environment supports it (e.g. session cookies).
 */
const AddressSelection = (props: AddressSelectionProps) => {
  return <AddressSelectionClient {...props} />;
};

export default AddressSelection;
