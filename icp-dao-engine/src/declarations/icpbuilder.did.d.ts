import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Action {
  'id' : bigint,
  'action_name' : string,
  'action_type' : string,
  'action_obj' : Object,
}
export interface App {
  'id' : bigint,
  'app_creator' : User,
  'app_name' : string,
  'app_state' : Array<bigint>,
  'app_actions' : Array<bigint>,
  'app_objects' : Array<bigint>,
}
export interface Field {
  'id' : bigint,
  'field_name' : string,
  'field_type' : string,
}
export interface Object {
  'id' : bigint,
  'obj_name' : string,
  'obj_fields' : Array<bigint>,
}
export interface State {
  'id' : bigint,
  'state_app' : App,
  'state_name' : string,
  'state_type' : Object,
}
export interface User {
  'id' : bigint,
  'user_apps' : Array<bigint>,
  'user_username' : string,
}
export interface _SERVICE {
  'create_action' : ActorMethod<[string, string, bigint, bigint], undefined>,
  'create_app' : ActorMethod<[bigint, string], undefined>,
  'create_field' : ActorMethod<[string, string, bigint], undefined>,
  'create_object' : ActorMethod<[string, bigint], [] | [bigint]>,
  'create_state' : ActorMethod<[string, bigint, bigint], undefined>,
  'get_actions_from_app_id' : ActorMethod<[bigint], [] | [Array<Action>]>,
  'get_app' : ActorMethod<[bigint], [] | [App]>,
  'get_fields_from_obj_id' : ActorMethod<[bigint], [] | [Array<Field>]>,
  'get_objects_from_app_id' : ActorMethod<[bigint], [] | [Array<Object>]>,
  'get_states_from_app_id' : ActorMethod<[bigint], [] | [Array<State>]>,
  'get_user' : ActorMethod<[bigint], [] | [User]>,
  'new_user' : ActorMethod<[], bigint>,
}
