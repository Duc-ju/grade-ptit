export default function getDroppedRankInfo(semesterState: any) {
  const maxFailPercent = 5;
  let totalCount = 0;
  let failedCount = 0;
  for (let semester of semesterState) {
    for (let subject of semester.subjects) {
      if (subject.mark === 0) failedCount += subject.credit;
      totalCount += subject.credit;
    }
  }
  let maxFailCredit = Math.round((totalCount * maxFailPercent) / 100);
  return {
    totalCount,
    failedCount,
    maxFailCredit,
    maxFailPercent,
    isDropped: failedCount > maxFailCredit,
  };
}
