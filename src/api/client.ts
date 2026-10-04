const BASE_URL = "https://students.netoservices.ru/fe-diplom";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new ApiError("Не удалось подключиться к серверу", 0);
  }

  if (!response.ok) {
    let message = `Ошибка запроса (${response.status})`;
    try {
      const data = await response.json();
      if (data && typeof data.error === "string") message = data.error;
    } catch {
      void 0;
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}
