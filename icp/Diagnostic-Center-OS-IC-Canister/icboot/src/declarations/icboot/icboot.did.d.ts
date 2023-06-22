import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'get' : (
      arg_0: { 'count' : bigint, 'filename' : string, 'sector_no' : bigint },
    ) => Promise<Array<number>>,
  'listing' : () => Promise<Array<[string, bigint]>>,
  'print' : () => Promise<undefined>,
  'put' : (
      arg_0: {
        'filename' : string,
        'data_vec' : Array<number>,
        'sector_no' : bigint,
      },
    ) => Promise<undefined>,
  'setlen' : (arg_0: { 'len' : bigint, 'filename' : string }) => Promise<
      undefined
    >,
}
