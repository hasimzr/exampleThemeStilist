import axios from "axios";

export const registerSite = (site: any) => axios.post("/site/save", site);
export const myDomains = () => axios.get("/site/MyDomains");
