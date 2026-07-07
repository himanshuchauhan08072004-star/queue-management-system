import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createQueueRequest,
  deleteQueueRequest,
  fetchQueues,
  updateQueueRequest,
} from "../api/queue.api";
import { extractErrorMessage } from "../api/axios";
import { QueueStatus } from "../types";

const QUEUES_KEY = ["queues"];

export function useQueues() {
  return useQuery({
    queryKey: QUEUES_KEY,
    queryFn: fetchQueues,
    refetchInterval: 15000,
  });
}

export function useCreateQueue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createQueueRequest(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUEUES_KEY });
      toast.success("Queue created");
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useUpdateQueue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, name }: { id: string; status?: QueueStatus; name?: string }) =>
      updateQueueRequest(id, { status, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUEUES_KEY });
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}

export function useDeleteQueue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQueueRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUEUES_KEY });
      toast.success("Queue deleted");
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
  });
}
