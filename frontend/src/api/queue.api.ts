import { apiClient } from "./axios";
import { Queue, QueueStatus } from "../types";

export async function fetchQueues(): Promise<Queue[]> {
  const { data } = await apiClient.get<Queue[]>("/queues");
  return data;
}

export async function createQueueRequest(name: string): Promise<Queue> {
  const { data } = await apiClient.post<Queue>("/queues", { name });
  return data;
}

export async function updateQueueRequest(
  id: string,
  payload: { name?: string; status?: QueueStatus }
): Promise<Queue> {
  const { data } = await apiClient.put<Queue>(`/queues/${id}`, payload);
  return data;
}

export async function deleteQueueRequest(id: string): Promise<void> {
  await apiClient.delete(`/queues/${id}`);
}
