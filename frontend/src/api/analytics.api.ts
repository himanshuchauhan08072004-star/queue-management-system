import { apiClient } from "./axios";
import { Analytics } from "../types";

export async function fetchAnalytics(): Promise<Analytics> {
  const { data } = await apiClient.get<Analytics>("/analytics");
  return data;
}
