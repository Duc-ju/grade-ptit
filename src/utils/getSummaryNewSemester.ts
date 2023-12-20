import { Semester } from "../entity/semester";

export default function getSummaryNewSemester(
  semester: Semester,
  passCheck?: boolean
) {
  const subjectsFilter = semester.subjects.filter(
    (subject) => subject.mark !== undefined
  );
  const sumProduct = subjectsFilter.reduce((prev, curr) => {
    return (
      prev + curr.credit * (curr.newMark ? curr.newMark || 0 : curr.mark || 0)
    );
  }, 0);
  const sumPass = subjectsFilter.reduce((prev, curr) => {
    if (curr.mark === 0 && !curr.newMark) return prev;
    return prev + curr.credit;
  }, 0);
  const sumCredit = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.credit;
  }, 0);
  return {
    sumPass: sumPass,
    average: sumProduct / (passCheck ? sumPass : sumCredit),
  };
}
