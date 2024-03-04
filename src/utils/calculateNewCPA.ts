import { Semester } from "../entity/semester";
import calculateNewGPASemester from "./calculateNewGPASemester";

export default function calculateNewCPA(semesterState: Semester[]) {
  let editedSubjects = semesterState.flatMap((semester) =>
    semester.subjects.filter((subject) => subject.mark !== undefined)
  );
  const calculatedGPA = calculateNewGPASemester(
    {
      subjects: editedSubjects,
    },
    true
  );
  return {
    ...calculatedGPA,
    cpa: calculatedGPA.gpa,
  };
}
