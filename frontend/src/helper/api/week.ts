import { getAxiosInstance } from ".";

export const publishWeek = async (id: string) => {
  const api = getAxiosInstance()
  const { data } = await api.patch(`/weeks/${id}`)
  return data;
}