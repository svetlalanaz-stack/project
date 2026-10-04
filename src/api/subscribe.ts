import { apiGet } from "./client";

export type SubscribeResponse = {
  status: boolean;
  email?: string;
};

export async function subscribeToNews(email: string): Promise<SubscribeResponse> {
  return apiGet<SubscribeResponse>(
    `/subscribe?email=${encodeURIComponent(email)}`,
  );
}