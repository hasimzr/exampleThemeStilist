import axios from "axios";
import { ServerApi } from "@/Api/ServerApi";

export const getAllCategoriesWithImgApi = () =>
  axios.get("/category/getAllCategoriesWhitImg/site");

export const getAllCategoriesWithImgApiServer = async () => {
  const api = await ServerApi();
  return api.get("/category/getAllCategoriesWhitImg/site");
}

export const getAllCategoriesApi = () =>
  axios.get(`/category/getAllCategories/site`);

export const getAllCategoriesApiServer = async () => {
  const api = await ServerApi();
  return api.get("/category/getAllCategories/site");
}
