import * as shiftRepository from "../database/default/repository/shiftRepository";
import { FindConditions, FindManyOptions, FindOneOptions, Not } from "typeorm";
import Shift from "../database/default/entity/shift";
import { ICreateShift, IUpdateShift, WeekStatus } from "../shared/interfaces";
import { HttpError } from "../shared/classes/HttpError";
import * as weekUsecase from "./weekUsecase";
import moment from "moment";
import Week from "../database/default/entity/week";

export const find = async (opts: FindManyOptions<Shift>): Promise<Shift[]> => {
  return shiftRepository.find(opts);
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  return shiftRepository.findById(id, opts);
};

export const create = async (payload: ICreateShift): Promise<Shift> => {
  let isOverlapping = await checkOverlappingShift(payload);

  if (isOverlapping) {
    throw new HttpError(400, "Shift is overlapping");
  }

  const weekNo = moment(payload.date, "DD-MM-YYYY").isoWeek();
  let week: Week = await weekUsecase.findOne({
    week: weekNo,
  });

  if (!week) {
    let [startDate, endDate] = weekUsecase.getWeekRange(payload.date);
    week = new Week();
    week.startDate = startDate;
    week.endDate = endDate;
    week.week = weekNo;

    week = await weekUsecase.create(week);
  }

  if (week.status === WeekStatus.PUBLISHED) {
    throw new HttpError(400, "Cannot create shift in published week");
  }

  const shift = new Shift();
  shift.name = payload.name;
  shift.date = payload.date;
  shift.startTime = payload.startTime;
  shift.endTime = payload.endTime;
  shift.week = week;
  
  return shiftRepository.create(shift);
};

export const updateById = async (
  id: string,
  payload: IUpdateShift
): Promise<Shift> => {
  let shift: Shift = await findById(id);

  if (!shift) {
    throw new HttpError(404, "Shift not found");
  }

  if (shift.week.status === WeekStatus.PUBLISHED) {
    throw new HttpError(400, "Published shift cannot be updated");
  }

  let isOverlapping = await checkOverlappingShift(payload, id);

  if (isOverlapping) {
    throw new HttpError(400, "Shift is overlapping");
  }

  return shiftRepository.updateById(id, {
    ...payload,
  });
};

export const deleteById = async (id: string | string[]) => {
  if (typeof id === "string") {
    let shift: Shift = await findById(id);

    if (!shift) {
      throw new HttpError(400, "Shift not found");
    }

    if (shift.week.status === WeekStatus.PUBLISHED) {
      throw new HttpError(400, "Published shift cannot deleted");
    }
    return shiftRepository.deleteById(id);
  } else {
    id.map(async (entry) => {
      let shift: Shift = await findById(entry);
      if (shift.week.status === WeekStatus.PUBLISHED) {
        throw new HttpError(400, "Published shift cannot be deleted");
      }
    });
  }

  return shiftRepository.deleteById(id);
};

export const checkOverlappingShift = async (
  shift: Shift | ICreateShift | IUpdateShift,
  id?: string
): Promise<Boolean> => {

  let where: FindConditions<Shift> = {
    date: shift.date,
  }
  if (id) {
    where.id = Not(id)
  }
  const todayShifts = await find({
    where
  });
  const timeRegex = /([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]?/;
  const startTimeCheck = timeRegex.test(shift.startTime);
  const endTimeCheck = timeRegex.test(shift.endTime);

  if(!startTimeCheck) {
    shift.startTime += ":00"
  }
  
  if(!endTimeCheck) {
    shift.endTime += ":00"
  }

  for (let i = 0; i < todayShifts.length; i++) {
    let startTimeOverlap =
      shift.startTime > todayShifts[i].startTime &&
      shift.startTime < todayShifts[i].endTime;
    let endTimeOverlap =
      shift.endTime > todayShifts[i].startTime &&
      shift.endTime < todayShifts[i].endTime;

    console.log({startTimeOverlap, endTimeOverlap})
    if (startTimeOverlap || endTimeOverlap) {
      return true;
    }
  }

  return false;
};
