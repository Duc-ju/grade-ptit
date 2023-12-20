import { Semester } from "../entity/semester";

export default function getSummaryNew(semesterState: Semester[]) {
  const semesterMap = semesterState.map((semester) => {
    const subjectsFilter = semester.subjects.filter(
      (subject) => subject.mark !== undefined && subject.mark !== null
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
      sum: sumCredit,
      sumPass: sumPass,
      sumProduct,
    };
  });
  const subjectsFilter = semesterMap.filter(
    (subject) => subject !== undefined && subject !== null
  );
  const sumProduct = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.sumProduct;
  }, 0);
  const sumCredit = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.sum;
  }, 0);
  const sumPass = subjectsFilter.reduce((prev, curr) => {
    return prev + curr.sumPass;
  }, 0);
  return {
    sum: sumCredit,
    sumPass,
    average: sumProduct / sumPass,
  };
}
