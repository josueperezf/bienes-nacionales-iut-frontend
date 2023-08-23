export interface ErrorResponse {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: Error;
}

interface Error {
  message: string;
  errors: Errors;
}

interface Errors {
  nombre: string[];
}

interface Headers {
  normalizedNames: any;
  lazyUpdate?: any;
}

