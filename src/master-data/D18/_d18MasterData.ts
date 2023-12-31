import D18_ATTT from "./ATTT.json";
import D18_CNTT_HTTT from "./CNTT_HTTT.json";
import D18_KT from "./KT.json";
import { ATTT, CNTT_HTTT, KT } from "../masterConstrain";

export const D18_MASTER_DATA = new Map<string, any>([
  [ATTT, D18_ATTT],
  [CNTT_HTTT, D18_CNTT_HTTT],
  [KT, D18_KT],
]);
