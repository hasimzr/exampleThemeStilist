"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/Api/ApiConstants';

const PaymentTestClient: React.FC = () => {
    const [orderID, setOrderID] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handlePaymentTest = async () => {
        if (!orderID) {
            alert('Lütfen bir Order ID giriniz.');
            return;
        }

        setLoading(true);
        try {
            // Fetch the payment HTML from backend
            const response = await axios.get(`${BASE_URL}/test/payment/${orderID}`, {
                responseType: 'text'
            });

            const htmlContent = response.data;

            // Replace entire page content with the received HTML
            document.open();
            document.write(htmlContent);
            document.close();
        } catch (error) {
            console.error('Payment request failed:', error);
            alert('Ödeme testi sırasında bir hata oluştu. Detaylar için konsola bakınız.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={titleStyle}>Ödeme Testi</h1>
                <p style={descriptionStyle}>
                    Test etmek istediğiniz siparişin ID'sini girerek ödeme sayfasını simüle edebilirsiniz.
                </p>

                <div style={inputGroupStyle}>
                    <label htmlFor="orderID" style={labelStyle}>Sipariş ID (Order ID)</label>
                    <input
                        id="orderID"
                        type="text"
                        placeholder="Örn: 12345"
                        value={orderID}
                        onChange={(e) => setOrderID(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePaymentTest()}
                        style={inputStyle}
                    />
                </div>

                <button
                    onClick={handlePaymentTest}
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        backgroundColor: loading ? '#a0aec0' : '#3182ce',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Yükleniyor...' : 'Ödemeyi Başlat'}
                </button>

                <div style={footerStyle}>
                    Backend enpoint: <code>{BASE_URL}/test/payment/{"{orderID}"}</code>
                </div>
            </div>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    padding: '20px',
};

const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '10px',
};

const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#718096',
    marginBottom: '30px',
};

const inputGroupStyle: React.CSSProperties = {
    textAlign: 'left',
    marginBottom: '24px',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    transition: 'background-color 0.2s',
};

const footerStyle: React.CSSProperties = {
    marginTop: '24px',
    fontSize: '12px',
    color: '#a0aec0',
    borderTop: '1px solid #edf2f7',
    paddingTop: '16px',
};

export default PaymentTestClient;
