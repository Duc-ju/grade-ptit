import calculateGPASemester from "./calculateGPASemester";
import { Semester } from "../entity/semester";
import { Subject } from "../entity/subject";

export default function calculateCPAToSemester(
  semesterIndex: number,
  semesterState: Semester[]
) {
  let editedSubjects: Subject[] = [];
  for (let i = 0; i <= semesterIndex; i++) {
    editedSubjects = [
      ...editedSubjects,
      ...semesterState[i].subjects.filter(
        (subject) => subject.mark !== undefined
      ),
    ];
  }
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
