import { apiGet } from "./client";

type ApiCity = { _id: string; name: string };
type ApiStation = {
  railway_station_name: string;
  city: ApiCity;
  datetime: number;
};

type ApiLastItem = {
  min_price: number;
  departure: {
    from: ApiStation;
    to: ApiStation;
  };
};

export type RecentTicket = {
  from: string;
  fromSub: string;
  to: string;
  toSub: string;
  price: number;
};

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function fetchLastRoutes(): Promise<RecentTicket[]> {
  const data = await apiGet<ApiLastItem[]>("/routes/last");

  return data.map((item) => ({
    from: capitalize(item.departure.from.city.name),
    fromSub: item.departure.from.railway_station_name,
    to: capitalize(item.departure.to.city.name),
    toSub: item.departure.to.railway_station_name,
    price: item.min_price,
  }));
}
