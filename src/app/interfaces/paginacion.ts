import { SortDirection } from "@angular/material/sort";

export interface PaginacionParams {
  buscar: string,
  direction: SortDirection,
  page: number,
  pageSize?: number
  sort: string,
}
