export const idlFactory = ({ IDL }) => {
  const Object = IDL.Record({
    'id' : IDL.Int,
    'obj_name' : IDL.Text,
    'obj_fields' : IDL.Vec(IDL.Int),
  });
  const Action = IDL.Record({
    'id' : IDL.Int,
    'action_name' : IDL.Text,
    'action_type' : IDL.Text,
    'action_obj' : Object,
  });
  const User = IDL.Record({
    'id' : IDL.Int,
    'user_apps' : IDL.Vec(IDL.Int),
    'user_username' : IDL.Text,
  });
  const App = IDL.Record({
    'id' : IDL.Int,
    'app_creator' : User,
    'app_name' : IDL.Text,
    'app_state' : IDL.Vec(IDL.Int),
    'app_actions' : IDL.Vec(IDL.Int),
    'app_objects' : IDL.Vec(IDL.Int),
  });
  const Field = IDL.Record({
    'id' : IDL.Int,
    'field_name' : IDL.Text,
    'field_type' : IDL.Text,
  });
  const State = IDL.Record({
    'id' : IDL.Int,
    'state_app' : App,
    'state_name' : IDL.Text,
    'state_type' : Object,
  });
  return IDL.Service({
    'create_action' : IDL.Func([IDL.Text, IDL.Text, IDL.Int, IDL.Int], [], []),
    'create_app' : IDL.Func([IDL.Int, IDL.Text], [], []),
    'create_field' : IDL.Func([IDL.Text, IDL.Text, IDL.Int], [], []),
    'create_object' : IDL.Func([IDL.Text, IDL.Int], [IDL.Opt(IDL.Int)], []),
    'create_state' : IDL.Func([IDL.Text, IDL.Int, IDL.Int], [], []),
    'get_actions_from_app_id' : IDL.Func(
        [IDL.Int],
        [IDL.Opt(IDL.Vec(Action))],
        ['query'],
      ),
    'get_app' : IDL.Func([IDL.Int], [IDL.Opt(App)], ['query']),
    'get_fields_from_obj_id' : IDL.Func(
        [IDL.Int],
        [IDL.Opt(IDL.Vec(Field))],
        ['query'],
      ),
    'get_objects_from_app_id' : IDL.Func(
        [IDL.Int],
        [IDL.Opt(IDL.Vec(Object))],
        ['query'],
      ),
    'get_states_from_app_id' : IDL.Func(
        [IDL.Int],
        [IDL.Opt(IDL.Vec(State))],
        ['query'],
      ),
    'get_user' : IDL.Func([IDL.Int], [IDL.Opt(User)], ['query']),
    'new_user' : IDL.Func([], [IDL.Int], []),
  });
};
export const init = ({ IDL }) => { return []; };
