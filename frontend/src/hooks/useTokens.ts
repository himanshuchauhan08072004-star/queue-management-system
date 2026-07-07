import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  cancelTokenRequest,
  createTokenRequest,
  CreateTokenPayload,
  fetchTokens,
  reorderTokenRequest,
  serveTokenRequest,
} from "../api/token.api";
import { extractErrorMessage } from "../api/axios";

const tokensKey = (queueId?: string) => ["tokens", queueId ?? "all"];

export function useTokens(queueId?: string) {
  return useQuery({
    queryKey: tokensKey(queueId),
    queryFn: () => fetchTokens(queueId),
    enabled: !!queueId,
    refetchInterval: 5000,
  });
}

export function useCreateToken(queueId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTokenPayload) => createTokenRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokensKey(queueId) });
      queryClient.invalidateQueries({ queryKey: ["queues"] });
      toast.success("Token added to queue");
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useReorderToken(queueId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tokenId, direction }: { tokenId: string; direction: "UP" | "DOWN" }) =>
      reorderTokenRequest(queueId ?? "", tokenId, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokensKey(queueId) });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useServeToken(queueId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => serveTokenRequest(queueId ?? ""),
    onSuccess: (token) => {
      queryClient.invalidateQueries({ queryKey: tokensKey(queueId) });
      queryClient.invalidateQueries({ queryKey: ["queues"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success(`Served ${token.tokenNumber} — ${token.customerName}`);
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useCancelToken(queueId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tokenId: string) => cancelTokenRequest(tokenId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokensKey(queueId) });
      queryClient.invalidateQueries({ queryKey: ["queues"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Token cancelled");
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
