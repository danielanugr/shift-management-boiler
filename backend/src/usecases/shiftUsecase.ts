import * as shiftRepository from "../database/default/repository/shiftRepository";
import { FindManyOptions, FindOneOptions } from "typeorm";
import Shift from "../database/default/entity/shift";
import { ICreateShift, IUpdateShift, ShiftStatus } from "../shared/interfaces";

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

  const todayShifts = await find({
    where: {
      date: payload.date,
    }
  })

  let isOverlapping: Boolean = false;

  for (let i = 0; i < todayShifts.length; i++) {
    if (payload.startTime > todayShifts[i].startTime && payload.startTime < todayShifts[i].endTime) {
      isOverlapping = true;
      break;
    }
  }

  if (isOverlapping) {
    throw new Error('shift is overlapping')
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
  return shiftRepository.updateById(id, {
    ...payload,
  });
};

export const deleteById = async (id: string | string[]) => {
  return shiftRepository.deleteById(id);
};
