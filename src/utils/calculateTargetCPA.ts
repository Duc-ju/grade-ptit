import { Semester } from "../entity/semester";

export default function getSummaryTarget(semesterState: Semester[]) {
  const semesterMap = semesterState.map((semester) => {
    const subjectsFilter = semester.subjects.filter(
      (subject) => subject.mark !== undefined && subject.mark !== null
    );
    const sumProduct = subjectsFilter.reduce((prev, curr) => {
      const mark = curr.targetMark
        ? curr.targetMark
        : curr.newMark
        ? curr.newMark
        : curr.mark;
      return prev + curr.credit * (mark || 0);
    }, 0);
    const sumOfPassedSubjectCredit = subjectsFilter.reduce((prev, curr) => {
      if (curr.mark === 0 && !curr.newMark && !curr.targetMark) return prev;
      return prev + curr.credit;
    }, 0);
    const sumOfSubjectCredit = subjectsFilter.reduce((prev, curr) => {
      return prev + curr.credit;
    }, 0);
    return {
      sumOfSubjectCredit,
      sumOfPassedSubjectCredit,
      sumProduct,
    };
  });
  const subjectsFilter = semesterMap.filter(
    (subject) => subject !== undefined && subject !== null
  );
  const sumProduct = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.sumProduct;
  }, 0);
  const sumOfSubjectCredit = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.sumOfSubjectCredit;
  }, 0);
  const sumOfPassedSubjectCredit = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.sumOfPassedSubjectCredit;
  }, 0);
  return {
    sumOfSubjectCredit,
    sumOfPassedSubjectCredit,
    average: sumProduct / sumOfPassedSubjectCredit,
  };
}
