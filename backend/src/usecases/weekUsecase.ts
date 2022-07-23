import * as weekRepository from "../database/default/repository/weekRepository";
import { FindConditions, FindManyOptions, FindOneOptions } from "typeorm";
import Week from "../database/default/entity/week";
import { ICreateWeek, WeekStatus } from "../shared/interfaces";
import moment from "moment";
import { HttpError } from "../shared/classes/HttpError";

export const find = async (opts: FindManyOptions<Week>): Promise<Week[]> => {
  return weekRepository.find(opts);
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Week>
): Promise<Week> => {
  return weekRepository.findById(id, opts);
};

export const findOne = async (
  where: FindConditions<Week>,
  opts?: FindOneOptions<Week>
): Promise<Week> => {
  return weekRepository.findOne(where, opts);
};

export const create = async (payload: ICreateWeek): Promise<Week> => {
  const week = new Week();
  week.week = payload.week;
  week.startDate = payload.startDate;
  week.endDate = payload.endDate;

  return weekRepository.create(week);
};

export const publishWeek = async (id: string) => {
  const week = await findById(id);
  if (!week) {
    throw new HttpError(404, "Week not found");
  }

  week.status = WeekStatus.PUBLISHED;
  return await weekRepository.updateById(id, week);
};

export const getWeekRange = (date: string) => {
  const firstDay = moment(date, "YYYY-MM-DD")
    .startOf("isoWeek")
    .format("YYYY-MM-DD");
  const lastDay = moment(date, "YYYY-MM-DD")
    .endOf("isoWeek")
    .format("YYYY-MM-DD");

  return [firstDay, lastDay];
};
