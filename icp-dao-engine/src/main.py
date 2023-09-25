from kybra import query, update, Record, opt, ic


class Action(Record):
    id: int
    action_name: str
    action_type: str # get or set or delete
    action_obj: "Object"

class Field(Record):
    id: int
    field_name: str
    field_type: str


class Object(Record):
    id: int
    obj_name: str
    obj_fields: list[int]


class State(Record):
    id: int
    state_name: str
    state_type: "Object"
    state_app: "App"


class App(Record):
    id: int
    app_creator: "User"
    app_name: str
    app_state: list[int]
    app_objects: list[int]
    app_actions: list[int]


class User(Record):
    id: int
    user_apps: list[int]
    user_username: str


# Global State
users: list[User] = []
apps: list[App] = []
states: list[State] = []
objects: list[Object] = []
fields: list[Field] = []
actions: list[Action] = []


# User operations
@query
def get_user(id: int) -> opt[User]:
    if id > len(users)-1:
        return None
    
    return users[id]


@update
def new_user() -> int:
    global users

    id = len(users)
    user: User = {
        "id": id,
        "user_apps": [],
        "user_username": ic.caller().to_str(),
    }
    users.append(user)
    return id


# App operations
@update
def create_app(creator: int, name: str):
    global apps
    global users

    # Only if the app creator exists, we create the app
    for user in users:
        if user["id"] == creator:
            app: App = {
                "id": len(apps),
                "app_creator": user,
                "app_name": name,
                "app_state": [],
                "app_objects":[],
                "app_actions":[]
            }
            user["user_apps"].append(len(apps))
            apps.append(app)


@query
def get_app(id: int) -> opt[App]:
    if id > len(apps)-1:
        return None
    
    return apps[id]


# State operations
@update
def create_state(name: str, obj_id: int, app_id: int):
    global apps

    # Only if the app exists, we create the state
    if app_id <= len(apps):
        state: State = {
            "id": len(states),
            "state_name": name,
            "state_type": objects[obj_id],
            "state_app": apps[app_id]
        }
        apps[app_id]["app_state"].append(len(states))
        states.append(state)


@query
def get_states_from_app_id(id: int) -> opt[list[State]]:
    if id > len(apps)-1:
        return None
    
    app_state = []
    for s in apps[id]["app_state"]:
        app_state.append(states[s])

    return app_state


# Object operations
@update
def create_object(name: str, app_id: int) -> opt[int]:
    global objects
    global apps

    # Only if the app exists, we create the object
    if app_id <= len(apps):
        obj: Object = {
            "id": len(objects),
            "obj_name": name,
            "obj_fields": [],
        }
        apps[app_id]["app_objects"].append(len(objects))
        objects.append(obj)

        return obj["id"]


@query
def get_objects_from_app_id(id: int) -> opt[list[Object]]:
    if id > len(apps)-1:
        return None
    
    app_objs = []
    for obj in apps[id]["app_objects"]:
        app_objs.append(objects[obj])

    return app_objs
    

# Field operations
@update
def create_field(name: str, type: str, obj_id: int):
    global fields
    global objects

    # Only if the object exists, we create the field
    if obj_id <= len(objects):
        field: Field = {
            "id": len(fields),
            "field_name": name,
            "field_type": type,
        }
        objects[obj_id]["obj_fields"].append(len(fields))
        fields.append(field)


@query
def get_fields_from_obj_id(id: int) -> opt[list[Field]]:
    if id > len(objects)-1:
        return None
    
    objects_fields = []
    for f in objects[id]["obj_fields"]:
        objects_fields.append(fields[f])

    return objects_fields


# Action operations
@update
def create_action(name: str, type: str, obj_id: int, app_id: int):
    global actions
    global apps

    # Only if the object exists, we create the action
    if obj_id <= len(objects):
        action: Action = {
            "id": len(actions),
            "action_name": name,
            "action_type": type,
            "action_obj": objects[obj_id]
        }
        apps[app_id]["app_actions"].append(len(actions))
        actions.append(action)


@query
def get_actions_from_app_id(id: int) -> opt[list[Action]]:
    if id > len(apps)-1:
        return None
    
    app_actions = []
    for ac in apps[id]["app_actions"]:
        app_actions.append(actions[ac])

    return app_actions