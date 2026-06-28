import React from 'react';
import PaymentTestClient from './PaymentTestClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ödeme Testi | ZmrElektronik',
    description: 'Sipariş ID ile ödeme akışını test edin.',
};

/**
 * PaymentTest Page (Server Component)
 * This is now a Server Component by default, which renders the PaymentTestClient.
 */
const PaymentTest: React.FC = () => {
    return <PaymentTestClient />;
};

export default PaymentTest;
