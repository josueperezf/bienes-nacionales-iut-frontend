export interface Marca {
    id:number,
    nombre:string,
    deleted_at?: any,
    created_at?: Date,
    updated_at?: Date
}

export interface MarcaPaginate {
  current_page: number;
  data: Marca[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url?: any;
  path: string;
  per_page: number;
  prev_page_url?: any;
  to: number;
  total: number;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}
