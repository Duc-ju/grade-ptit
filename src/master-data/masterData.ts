import { D18_MASTER_DATA } from "./D18/_d18MasterData";
import { D19_MASTER_DATA } from "./D19/_d19MasterData";
import { D20_MASTER_DATA } from "./D20/_d20MasterData";
import { D21_MASTER_DATA } from "./D21/_d21MasterData";
import { D22_MASTER_DATA } from "./D22/_d22MasterData";
import { D18, D19, D20, D21, D22 } from "./masterConstrain";

export const MASTER_DATA = new Map<string, Map<string, any>>([
  [D18, D18_MASTER_DATA],
  [D19, D19_MASTER_DATA],
  [D20, D20_MASTER_DATA],
  [D21, D21_MASTER_DATA],
  [D22, D22_MASTER_DATA],
]);

export const getMasterCourseKeyList = () => {
  return Array.from(MASTER_DATA.keys());
};

export const getMasterMajorKeyList = (course: string) => {
  if (!course) return [];
  const courseMaster = MASTER_DATA.get(course);
  return courseMaster ? Array.from(courseMaster.keys()) : [];
};

export const getMasterMajor = (course: string, major: string) => {
  return MASTER_DATA.get(course)?.get(major);
};
