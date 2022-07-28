export interface ICreateWeek {
  week: number;
  startDate: string;
  endDate: string;
  year: number;
}

export enum WeekStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}
