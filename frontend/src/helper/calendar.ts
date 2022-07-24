import { startOfISOWeek, endOfISOWeek, getISOWeek, format }from "date-fns"

export const calculateWeek = (date: Date): number => {
  return getISOWeek(date)
}

export const getWeekRange = (date: Date): string[] => {
  let startDate = format(startOfISOWeek(date), "MMM dd")
  let endDate = format(endOfISOWeek(date), "MMM dd")

  return [startDate, endDate]
}