import type { HtmlHTMLAttributes } from 'react';

export type AppSvgProps = HtmlHTMLAttributes<HTMLOrSVGElement>;
export type SearchQuery = Record<
  string,
  string | boolean | number | undefined | string[]
>;

export interface APPURL {
  href?: string;
  query?: SearchQuery;
}
