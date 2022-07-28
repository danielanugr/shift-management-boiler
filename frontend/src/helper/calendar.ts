import { startOfISOWeek, endOfISOWeek, getISOWeek, format, getYear }from "date-fns"

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