import React from "react";
import ModalCompanentClient, { type ModalComponentProps } from "./ModalCompanentClient";

/**
 * ModalCompanent following Next.js "Server Components by Default" philosophy.
 * It serves as a server-side entry point for the modal functionality,
 * rendering the interactive ModalCompanentClient.
 */
const ModalCompanent = (props: ModalComponentProps) => {
  return <ModalCompanentClient {...props} />;
};

export default ModalCompanent;
export type { ModalComponentProps };
