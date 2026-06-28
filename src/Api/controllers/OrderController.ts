import axios from "axios";

export const addOrderApi = (data: any) => axios.post(`/order/add`, data);
export const getMyOrderApi = () => axios.get(`/order/my-orders`);
export const getProductReviewApi = (orderId: string, productId: string) =>
  axios.get(`/order/product/review/${orderId}/${productId}`);
export const cancelOrderRequestApi = (orderId: string, reason: string) =>
  axios.post(`/order/cancel-request`, { orderId, reason });

export const submitProductReviewApi = (formData: FormData) =>
  axios.post(`/order/review`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getPaymentOptionsApi = (stringList: string[]) =>
  axios.post(`/payment-options/find/productsToPaymentOption`, { stringList });

export const initializeIyzicoPaymentApi = (data: any) =>
  axios.post(`/order/iyzico/payment/initialize`, data);
