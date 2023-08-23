import { PaginacionParams } from "../interfaces";

export const getUrlPaginate = ({paginacionParams: {buscar, direction, page, pageSize, sort}, url }:{paginacionParams: PaginacionParams, url: string}): string => {
  const urlObject = new URL(url);
  buscar && urlObject.searchParams.append("buscar", buscar);
  direction && urlObject.searchParams.append("direction", direction);
  page && urlObject.searchParams.append("page", page.toString());
  pageSize && urlObject.searchParams.append("pageSize", pageSize.toString());
  sort && urlObject.searchParams.append("sort", sort);
  return urlObject.href;
}
