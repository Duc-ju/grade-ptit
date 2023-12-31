import D18_ATTT from "./ATTT.json";
import D18_CNTT_HTTT from "./CNTT_HTTT.json";
import D18_CNTT_CNPM from "./CNTT_CNPM.json"
import {ATTT, CNTT_CNPM, CNTT_HTTT} from "../masterConstrain";

export const D18_MASTER_DATA = new Map<string, any>([
  [ATTT, D18_ATTT],
  [CNTT_HTTT, D18_CNTT_HTTT],
  [CNTT_CNPM, D18_CNTT_CNPM]
]);
