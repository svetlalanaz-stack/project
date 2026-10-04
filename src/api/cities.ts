import { apiGet } from "./client";

export type City = {
  _id: string;
  name: string;
};

export async function searchCities(query: string): Promise<City[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  return apiGet<City[]>(`/routes/cities?name=${encodeURIComponent(trimmed)}`);
}
