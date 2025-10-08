import { DateTime } from 'luxon';

export interface Conference {
  id: string;
  title: string;
  year: number;
  full_name: string;
  link?: string;
  deadline?: string;
  abstract_deadline?: string;
  timezone: string;
  date?: string;
  start?: string;
  end?: string;
  place?: string;
  sub: string | string[];
  note?: string;
  hindex?: number;
  paperslink?: string;
  pwclink?: string;
}

export interface DeadlineInfo {
  label: string;
  datetime: DateTime;
  localDatetime: DateTime;
}
