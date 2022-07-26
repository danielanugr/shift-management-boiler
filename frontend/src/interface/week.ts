export interface IWeek {
  week: number;
  startDate: string;
  endDate: string;
  year: number;
  status: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeekDataResult {
  newStartDate: string;
  newEndDate: string;
  week: number;
  year: number
}