import Joi from "joi";
import { WeekStatus } from "../interfaces";

export const createWeekDto = Joi.object({
  week: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  status: Joi.string().required()
});