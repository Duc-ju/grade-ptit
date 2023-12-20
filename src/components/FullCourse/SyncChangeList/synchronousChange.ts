import { Subject } from "../../../entity/subject";

export const SYNCHRONOUS_ADD = "add";
export const SYNCHRONOUS_DELETE = "delete";
export const SYNCHRONOUS_UPDATE = "update";

export interface SynchronousSubjectChange {
  oldInfo?: Subject;
  newInfo?: Subject;
  type:
    | typeof SYNCHRONOUS_ADD
    | typeof SYNCHRONOUS_DELETE
    | typeof SYNCHRONOUS_UPDATE;
  id: string[] | number;
}

export interface SynchronousSemesterChange {
  semester: {
    id: number;
    name: string;
  };
  changes: SynchronousSubjectChange[];
}
