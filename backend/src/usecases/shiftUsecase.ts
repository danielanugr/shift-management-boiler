import * as shiftRepository from "../database/default/repository/shiftRepository";
import { FindManyOptions, FindOneOptions } from "typeorm";
import Shift from "../database/default/entity/shift";
import { ICreateShift, IUpdateShift, ShiftStatus } from "../shared/interfaces";
import { HttpError } from "../shared/classes/HttpError";

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

  const shift = new Shift();
  shift.name = payload.name;
  shift.date = payload.date;
  shift.startTime = payload.startTime;
  shift.endTime = payload.endTime;

  return shiftRepository.create(shift);
};

export const updateById = async (
  id: string,
  payload: IUpdateShift
): Promise<Shift> => {
  let shift: Shift = await findById(id);

  if(!shift) {
    throw new HttpError(404, "Shift not found")
  }

  if (shift.status === ShiftStatus.PUBLISHED) {
    throw new HttpError(400, "Published shift cannot be updated");
  }

  let isOverlapping = await checkOverlappingShift(shift);

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

    if(!shift) {
      throw new HttpError(400, "Shift not found")
    }

    if (shift.status === ShiftStatus.PUBLISHED) {
      throw new HttpError(400, "Published shift cannot be deleted")
    }
    return shiftRepository.deleteById(id);
  } else {
    id.map(async (entry) => {
      let shift: Shift = await findById(entry);
      if (shift.status === ShiftStatus.PUBLISHED) {
        throw new HttpError(400, "Published shift cannot be deleted")
      }
    });
  }

  return shiftRepository.deleteById(id);
};

export const checkOverlappingShift = async (shift: Shift | ICreateShift): Promise<Boolean> => {
  const todayShifts = await find({
    where: {
      date: shift.date,
    },
  });

  for (let i = 0; i < todayShifts.length; i++) {
    let startTimeOverlap = shift.startTime > todayShifts[i].startTime && shift.startTime < todayShifts[i].endTime
    let endTimeOverlap = shift.endTime > todayShifts[i].startTime && shift.endTime < todayShifts[i].endTime
    
    if (startTimeOverlap || endTimeOverlap) {
      return true;
    }
  }

  return false;
}
