import { Semester } from "../entity/semester";
import calculateGPASemester from "./calculateGPASemester";

export default function calculateCPA(semesterState: Semester[]) {
  let editedSubjects = semesterState.flatMap((semester) =>
    semester.subjects.filter((subject) => subject.mark !== undefined)
  );
  const calculatedGPA = calculateGPASemester(
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
