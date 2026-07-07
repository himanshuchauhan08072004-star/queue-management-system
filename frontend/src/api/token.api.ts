import { apiClient } from "./axios";
import { Token } from "../types";

export interface CreateTokenPayload {
  queueId: string;
  customerName: string;
  mobile?: string;
  notes?: string;
}

export async function fetchTokens(queueId?: string): Promise<Token[]> {
  const { data } = await apiClient.get<Token[]>("/tokens", { params: { queueId } });
  return data;
}

export async function createTokenRequest(payload: CreateTokenPayload): Promise<Token> {
  const { data } = await apiClient.post<Token>("/tokens", payload);
  return data;
}

export async function reorderTokenRequest(
  queueId: string,
  tokenId: string,
  direction: "UP" | "DOWN"
): Promise<Token[]> {
  const { data } = await apiClient.patch<Token[]>("/tokens/reorder", {
    queueId,
    tokenId,
    direction,
  });
  return data;
}

export async function serveTokenRequest(queueId: string): Promise<Token> {
  const { data } = await apiClient.patch<Token>("/tokens/serve", { queueId });
  return data;
}

export async function cancelTokenRequest(tokenId: string): Promise<Token> {
  const { data } = await apiClient.patch<Token>("/tokens/cancel", { tokenId });
  return data;
}
