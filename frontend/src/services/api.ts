// frontend/src/services/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');

type QueryValue = string | number | boolean | null | undefined;

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string;
  query?: Record<string, QueryValue>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function defineUrl(
  path: string,
  parametro?: Record<string, QueryValue>
): string {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada.');
  }

  const normalizedPath = path.replace(/^\/+/, '');
  const params = new URLSearchParams();

  Object.entries(parametro ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  const parametroFormatado = params.toString();
  const url = `${API_BASE_URL}/${normalizedPath}${parametroFormatado ? `?${parametroFormatado}` : ''}`;

  return url;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    body,
    token,
    query,
    headers: customHeaders,
    ...requestOptions
  } = options;

  const headers = new Headers(customHeaders);

  headers.set('Accept', 'application/json');

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(defineUrl(path, query), {
    ...requestOptions,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  const responseBody = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof responseBody === 'object' &&
      responseBody !== null &&
      'detail' in responseBody &&
      typeof responseBody.detail === 'string'
        ? responseBody.detail
        : `A API respondeu com o status ${response.status}.`;

    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as T;
}