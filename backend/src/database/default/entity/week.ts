import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseTimestamp } from "./baseTimestamp";
import { WeekStatus } from "../../../shared/interfaces";
import Shift from "./shift";

@Entity()
export default class Week extends BaseTimestamp {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  week: number;

  @Column({
    type: "date",
  })
  startDate: string;

  @Column({
    type: "date",
  })
  endDate: string;

  @Column({
    type: "enum",
    enum: WeekStatus,
    default: WeekStatus.DRAFT,
  })
  status: WeekStatus;

  @OneToMany(() => Shift, (shift) => shift.week) shifts: Shift[];
}
