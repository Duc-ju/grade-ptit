import getSummarySemester from "./getSummarySemester";
import { Semester } from "../entity/semester";
import { Subject } from "../entity/subject";

export default function getSummarySemesterGroup(
  semesterIndex: number,
  semesterState: Semester[]
) {
  let subjectsFilter: Subject[] = [];
  for (let i = 0; i <= semesterIndex; i++) {
    subjectsFilter = [
      ...subjectsFilter,
      ...semesterState[i].subjects.filter(
        (subject) => subject.mark !== undefined
      ),
    ];
  }
  return getSummarySemester(
    {
      subjects: subjectsFilter,
    } as any,
    true
  );
}
