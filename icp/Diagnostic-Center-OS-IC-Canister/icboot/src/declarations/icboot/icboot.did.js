export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get' : IDL.Func(
        [
          IDL.Record({
            'count' : IDL.Nat,
            'filename' : IDL.Text,
            'sector_no' : IDL.Nat,
          }),
        ],
        [IDL.Vec(IDL.Nat8)],
        ['query'],
      ),
    'listing' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'print' : IDL.Func([], [], ['query']),
    'put' : IDL.Func(
        [
          IDL.Record({
            'filename' : IDL.Text,
            'data_vec' : IDL.Vec(IDL.Nat8),
            'sector_no' : IDL.Nat,
          }),
        ],
        [],
        [],
      ),
    'setlen' : IDL.Func(
        [IDL.Record({ 'len' : IDL.Nat, 'filename' : IDL.Text })],
        [],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
