import axios from "axios";

export const getProductReviewsApi = (productId: string, page = 1, limit = 10) =>
    axios.get(`/reviews/product-review/${productId}`, { params: { page, limit } });
