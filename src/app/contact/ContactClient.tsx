import React from "react";
import ContactForm from "./ContactForm";

/**
 * ContactClient component following the Next.js "Server Components by Default" philosophy.
 * Acts as a server-side wrapper for the contact form.
 */
const ContactClient = () => {
    return <ContactForm />;
};

export default ContactClient;
