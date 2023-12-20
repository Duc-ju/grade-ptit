import { Semester } from "../entity/semester";

export default function getSummarySemester(
  semester: Semester,
  passCheck?: boolean
) {
  const subjectsFilter = semester.subjects.filter(
    (subject) => subject.mark !== undefined && subject.mark !== null
  );
  const sumProduct = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.credit * (curr.mark || 0);
  }, 0);
  const sumPass = subjectsFilter.reduce((prev, curr) => {
    if (curr.mark === 0) return prev;
    return prev + curr.credit;
  }, 0);
  const sumCredit = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.credit;
  }, 0);
  return {
    sum: sumCredit,
    sumPass: sumPass,
    average: sumProduct / (passCheck ? sumPass : sumCredit),
  };
}
