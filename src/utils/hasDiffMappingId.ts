export default function hasDiffMappingId(mappingId1: any, mappingId2: any) {
  if (!mappingId1 && !mappingId2) return false;
  if (!mappingId1 || !mappingId2) return true;
  if (
    !mappingId1[0] &&
    !mappingId2[0] &&
    mappingId1.toUpperCase() !== mappingId2.toUpperCase()
  )
    return true;
  if (
    !mappingId1[0] &&
    !mappingId2[0] &&
    mappingId1.toUpperCase() === mappingId2.toUpperCase()
  )
    return false;
  if (
    !mappingId1[0] &&
    mappingId2
      .map((id: string) => id.toUpperCase())
      .includes(mappingId1.toUpperCase())
  )
    return false;
  if (
    !mappingId2[0] &&
    mappingId1
      .map((id: string) => id.toUpperCase())
      .includes(mappingId2.toUpperCase())
  )
    return false;
  if (!mappingId1[0] || !mappingId2[0]) return true;
  for (let id1 of mappingId1) {
    let findId = mappingId2.find(
      (id: string) => id.toUpperCase() === id1.toUpperCase()
    );
    if (!findId) return true;
  }
  return false;
}
