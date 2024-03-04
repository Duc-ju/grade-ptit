import calculateNewGPASemester from "./calculateNewGPASemester";
import { Semester } from "../entity/semester";
import { Subject } from "../entity/subject";

export default function calculateNewCPAToSemester(
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
