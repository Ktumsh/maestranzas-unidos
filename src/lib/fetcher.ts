interface ApplicationError extends Error {
  info: string;
  status: number;
}

export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "Ocurrió un error al obtener los datos.",
    ) as ApplicationError;
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
}
