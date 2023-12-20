import { Semester } from "./semester";

export interface File {
  id: string;
  uid: string;
  fullName: string;
  studentCode: string;
  course: string;
  major: string;
  semester: Semester[];
  isOwner: boolean;
  isPublic: boolean;
  root: boolean;
  keywords: string[];
  target?: string | number | undefined;
  createAt?: {
    nanoseconds: number;
    seconds: number;
  };
}
