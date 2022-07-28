import { startOfISOWeek, endOfISOWeek, getISOWeek, format, getYear }from "date-fns"
import { WeekDataResult } from "../interface"

export const calculateWeekAndYear = (date: Date): number[] => {
  let week = getISOWeek(date)
  let year = getYear(date)

  return [week, year]
}

export const getWeekRange = (date: Date): string[] => {
  let startDate = format(startOfISOWeek(date), "MMM dd")
  let endDate = format(endOfISOWeek(date), "MMM dd")

  return [startDate, endDate]
}

export const getLastWeek = (startDate: string | number): WeekDataResult => {
  let timestamp = new Date(startDate).setDate(new Date(startDate).getDate() - 1)
  let newStartDate = format(startOfISOWeek(timestamp), 'MMM dd');
  let newEndDate = format(endOfISOWeek(timestamp), "MMM dd");
  let week = getISOWeek(timestamp);
  let year = getYear(timestamp);

  return {
    newStartDate, newEndDate, week, year
  }
}

export const getNextWeek = (startDate: string | number): WeekDataResult => {
  let timestamp = new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 7))
  let newStartDate = format(timestamp, 'MMM dd');
  let newEndDate = format(endOfISOWeek(timestamp), "MMM dd");
  let week = getISOWeek(timestamp);
  let year = getYear(timestamp);

  return {
    newStartDate, newEndDate, week, year
  }
} 