export interface Subject {
  id: number;
  name: string;
  credit: number;
  mark?: number | undefined;
  newMark?: number | undefined;
  targetMark?: number;
  mappingId?: string[] | null | undefined;
  oldMappingId?: string[] | null | undefined;
  isCustom?: boolean;
}
