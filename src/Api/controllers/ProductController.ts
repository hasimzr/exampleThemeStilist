import axios from "axios";
import { ServerApi } from "@/Api/ServerApi";


// Paginated all products API. Defaults to page 1 and limit 10.
export const AllProductApi = (page = 1, limit = 10) =>
  axios.get("/products/all/for/sites", { params: { page, limit } });

export const AllProductApiServer = async (page = 1, limit = 10) => {
  const api = await ServerApi();
  return api.get("/products/all/for/sites", { params: { page, limit } });
}

// Paginated filtered products API. Accepts body `data` and query params `page` and `limit`.
export const ProductApi = (data: any, page = 1, limit = 10) =>
  axios.post(`/products/filter/for/sites`, data, { params: { page, limit } });

export const ProductApiServer = async (data: any, page = 1, limit = 10) => {
  const api = await ServerApi();
  return api.post(`/products/filter/for/sites`, data, { params: { page, limit } });
}

export const GetProductApi = (id: string) => axios.get(`/products/get/url/${id}`);


export const GetProductApiServer = async (id: string) => {
  const api = await ServerApi();
  return api.get(`/products/get/url/${id}`);
}

export const searchProductApi = (keyword: string) =>
  axios.get(`/products/search/${keyword}`);

export const addToFavoritesApi = (productId: string) =>
  axios.post(`/favorites/addOrRemove/${productId}`);

export const getFavoriteStatusApi = (productId: string) =>
  axios.get(`/favorites/status/${productId}`);

export const getFavoritesApi = () => axios.get(`/favorites/my/list`);

export const getFavoritesCountApi = () => axios.get(`/favorites/my/count`);
