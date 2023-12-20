import { Subject } from "./subject";

export interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
}
