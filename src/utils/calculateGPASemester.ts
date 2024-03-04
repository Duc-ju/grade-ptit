import { Semester } from "../entity/semester";
import { Subject } from "../entity/subject";

export default function calculateGPASemester(
  semester: Semester | { subjects: Subject[] },
  onlyPassedSubject?: boolean
) {
  const subjectsFilter = semester.subjects.filter(
    (subject) => subject.mark !== undefined && subject.mark !== null
  );
  const sumProduct = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.credit * (curr.mark || 0);
  }, 0);
  const sumSubjectPassedCredit = subjectsFilter.reduce((prev, curr) => {
    if (curr.mark === 0) return prev;
    return prev + curr.credit;
  }, 0);
  const sumAllSubjectCredit = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.credit;
  }, 0);
  return {
    sumOfSubjectCredit: sumAllSubjectCredit,
    sumOfPassedSubjectCredit: sumSubjectPassedCredit,
    gpa:
      sumProduct /
      (onlyPassedSubject ? sumSubjectPassedCredit : sumAllSubjectCredit),
  };
}
