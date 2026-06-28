import axios from "axios";

export const registerUser = (user: any) => axios.post("/user/site/save", user);

export const LoginUser = (credentials: any) =>
  axios.post("/user/site/login", credentials);

export const updateUserAvatarApi = (formData: any) => {
  return axios.post("/file/site/update-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUserProfileApi = (userData: any) =>
  axios.post("/user/site/update-profile", userData);

export const deleteUserAccountApi = (payload: any) =>
  axios.post("/user/site/delete-account", payload);

export const myAddressesSaveApi = (addresses: any) =>
  axios.post("/myAddress/save", addresses);

export const getMyAddressesApi = () => axios.get("/myAddress/get/all");
export const isDefaultChangeApi = (addressId: string) =>
  axios.post(`/myAddress/isDefault/change/${addressId}`);
export const removeAddressApi = (addressId: string) =>
  axios.post(`/myAddress/remove/${addressId}`);

// Şifremi Unuttum API'leri
export const forgotPassword = (email: string) =>
  axios.post("/user/site/forgot-password", { email });

export const resetPassword = (data: {
  email: string;
  code: string;
  newPassword: string;
}) => axios.post("/user/site/reset-password", data);
