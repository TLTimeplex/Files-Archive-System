export type ReportFilter = {
  author_id?: number[];
  date_created?: DateSelect;
  dateRange_created?: DateRange;
  date_updated?: DateSelect;
  dateRange_updated?: DateRange;
  tags?: string[];
  title?: string;
  archived?: boolean;
};

export type DateRange = {
  start: Date;
  end: Date;
};

export type DateSelect = {
  year: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
};

export type ReportFields = "id" | "title" | "description" | "author_id" | "date_created" | "date_modified" | "archived" | "access";

export type ReportFieldSelect = {
  [key in ReportFields]?: boolean;
};


export default ReportFilter;