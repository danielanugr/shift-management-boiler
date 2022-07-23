import { Server } from "@hapi/hapi";
import * as weekController from "./weekController";
import { filterSchema, idDto } from "../../../shared/dtos";

export default function (server: Server, basePath: string) {
  server.route({
    method: "GET",
    path: basePath,
    handler: weekController.find,
    options: {
      description: "Get weeks with filter",
      notes: "Get all weeks if filter is not specified.",
      tags: ["api", "week"],
    },
  });

  server.route({
    method: "PATCH",
    path: basePath + "/{id}",
    handler: weekController.publish,
    options: {
      description: "Publish week",
      notes: "Publish week",
      tags: ["api", "week"],
      validate: {
        params: idDto,
      },
    },
  });
}
