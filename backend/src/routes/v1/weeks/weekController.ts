import { Request, ResponseToolkit } from "@hapi/hapi";
import * as weekUsecase from "../../../usecases/weekUsecase";
import { errorHandler } from "../../../shared/functions";
import { ISuccessResponse } from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";

const logger = moduleLogger("weekController");

export const find = async (req: Request, h: ResponseToolkit) => {
  logger.info("Find weeks");
  try {
    const filter = req.query;
    const data = await weekUsecase.find(filter);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Get shift successful",
      results: data,
    };
    return res;
  } catch (err) {
    logger.error(err.message);
    return errorHandler(h, err);
  }
};

export const publish = async (req: Request, h: ResponseToolkit) => {
  logger.info("Publish week");
  try {
    const id = req.params.id;
    const data = await weekUsecase.publishWeek(id);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Week publish Successful",
      results: data,
    }
    return res;
  } catch (err) {
    logger.error(err.message);
    return errorHandler(h, err);
  }
}