import axios, { AxiosRequestConfig } from "axios";

export async function getuuid(username: string) {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: `https://api.mojang.com/users/profiles/minecraft/${username}`,
  };

  let uuid: string = "error";
  const res = await axios.request(options);
  const data = await res.data;
  uuid = data.id;

  return uuid;
}
