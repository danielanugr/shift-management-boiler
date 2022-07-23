export interface ICreateWeek {
  week: number;
  startDate: string;
  endDate: string;
}

export enum WeekStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}