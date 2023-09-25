const constructTree = (actions, objects, fields) => {
    const mutObjects = []
    for (let i = 0; i < objects.length; i++) {
        mutObjects[i] = {
            id: parseInt(objects[i].id),
            name: objects[i].obj_name,
            fields: fields[objects[i].id]
        }
    }

    const mutActions = []
    for (let i = 0; i < actions.length; i++) {
        mutActions[i] = {
            id: parseInt(actions[i].id),
            name: actions[i].action_name,
            type: actions[i].action_type,
            object: actions[i].action_obj
        }
    }

    const tree = {
        actions: mutActions,
        objects: mutObjects
    }
    return tree
}

const generateCode = tree => {
    let imports = ["Record"]

    const actions = tree.actions
    const objects = tree.objects

    // First we add necessary imports by looking at the possible actions to perform
    for (let i = 0; i < actions.length; i++) {
        if (actions[i].type === "get-one" || actions[i].type === "get-all") {
            imports.push("query")
            imports.push("opt")
        }
        if (actions[i].type === "set" || actions[i].type === "delete") {
            imports.push("update")
        }
    }

    imports = [...new Set(imports)]
    let importStmt = `from kybra import `
    for (let i = 0; i < imports.length; i++) {
        if (i === imports.length - 1) {
            importStmt += imports[i] + "\n"
        }
        else {
            importStmt += imports[i] + ", "
        }
    }

    let objectsStmt = ""

    for (let i = 0; i < objects.length; i++) {
        let objectCode = ``
        // We need to create a class in this case
        if (objects[i].fields.length > 0) {
            let fieldsCode = `\n\tid: int`
            for (let j = 0; j < objects[i].fields.length; j++) {
                const f = objects[i].fields[j]
                let field_type = ""
                if (f.field_type === "string") { field_type = "str" }
                else if (f.field_type === "integer") { field_type = "int" }
                else if (f.field_type === "boolean") { field_type = "bool" }
                fieldsCode += `\n\t${f.field_name}: ${field_type}`
            }

            objectCode += `class ${objects[i].name}(Record):${fieldsCode}`
        }
        // We need to create a simple type variable, not an object
        else {
            objectCode += `${objects[i].name.toLowerCase()}: str = ""`
        }

        objectsStmt += objectCode + "\n\n"
    }

    let statesStmt = ""

    for (let i = 0; i < objects.length; i++) {
        if (objects[i].fields.length > 0) {
            statesStmt += `${objects[i].name.toLowerCase()}s: list[${objects[i].name}] = []\n\n`
        }
    }

    let functionsStmt = ""

    for (let i = 0; i < actions.length; i++) {
        let args = []
        const state = `${actions[i].object.obj_name.toLowerCase()}s`
        if (actions[i].type === "get-one") {
            args.push({
                arg_name: "id",
                arg_type: "int"
            })

            let argsAsString = ""
            for (let j = 0; j < args.length; j++) {
                if (j === args.length - 1) {
                    argsAsString += args[j].arg_name + ": " + args[j].arg_type
                }
                else {
                    argsAsString += args[j].arg_name + ": " + args[j].arg_type + ", "
                }
            }

            let funcBody = ""
            if (actions[i].object.obj_fields.length > 0) {
                funcBody += `if id > len(${state})-1:\n\t\treturn None\n\treturn ${state}[id]`
            }
            else {
                funcBody += `if id > len(${actions[i].object.obj_name.toLowerCase()})-1:\n\t\treturn None\n\treturn ${actions[i].object.obj_name.toLowerCase()}[id]`
            }

            let functionCode = `@query\ndef ${actions[i].name.replace(/ /g, "_")}(${argsAsString}) -> opt[${actions[i].object.obj_name}]:\n\t${funcBody}`

            functionsStmt += functionCode + "\n\n"
        }
        else if (actions[i].type === "set") {
            for (let j = 0; j < objects.length; j++) {
                if (objects[j].id === parseInt(actions[i].object.id)) {
                    for (let q = 0; q < objects[j].fields.length; q++) {
                        const fieldValue = objects[j].fields[q].field_name
                        const fieldType = objects[j].fields[q].field_type
                        let type = ""

                        if (fieldType === "string") { 
                            type = "str" 
                        }
                        else if (fieldType === "integer") {
                            type = "int"
                        }
                        else if (fieldType === "boolean") {
                            type = "bool"
                        }

                        args.push({
                            arg_name: fieldValue,
                            arg_type: type
                        })
                    }
                }
            }

            let argsAsString = ""
            for (let j = 0; j < args.length; j++) {
                if (j === args.length - 1) {
                    argsAsString += args[j].arg_name + ": " + args[j].arg_type
                }
                else {
                    argsAsString += args[j].arg_name + ": " + args[j].arg_type + ", "
                }
            }

            let stateObject = `"id": id,\n\t\t`
            for (let j = 0; j < objects.length; j++) {
                if (objects[j].id === parseInt(actions[i].object.id)) {
                    for (let q = 0; q < objects[j].fields.length; q++) {
                        const fieldValue = objects[j].fields[q].field_name
                        stateObject += `"${fieldValue}": ${fieldValue},\n\t\t`
                    }
                }
            }

            let createCode = `_${state}: ${actions[i].object.obj_name} = {\n\t\t${stateObject}\n\t}`

            let funcBody = ""
            if (actions[i].object.obj_fields.length > 0) {
                funcBody += `global ${state}\n\n\tid = len(${state})\n\t${createCode}\n\t${state}.append(_${state})\n\treturn id`
            }

            let functionCode = `@update\ndef ${actions[i].name.replace(/ /g, "_")}(${argsAsString}) -> int:\n\t${funcBody}`
            functionsStmt += functionCode + "\n\n"
        }
        else if (actions[i].type === "get-all") {
            let funcBody = ""
            if (actions[i].object.obj_fields.length > 0) {
                funcBody += `return ${state}`
            }

            let functionCode = `@query\ndef ${actions[i].name.replace(/ /g, "_")}() -> list[${actions[i].object.obj_name}]:\n\t${funcBody}`
            functionsStmt += functionCode + "\n\n"
        }
    }

    const generatedCode = `${importStmt}\n${objectsStmt}${statesStmt}${functionsStmt}`

    return generatedCode
}

const getActionArguments = (action, objects) => {
    let args = []

    if (action.action_type === "get-one") {
        args.push({
            arg_name: "id",
            arg_type: "int"
        })
    }
    else if (action.action_type === "set") {
        for (let j = 0; j < objects.length; j++) {
            if (objects[j].id === parseInt(action.action_obj.id)) {
                for (let q = 0; q < objects[j].fields.length; q++) {
                    console.log(objects[j])
                    const fieldValue = objects[j].fields[q].field_name
                    const fieldType = objects[j].fields[q].field_type
                    let type = ""

                    if (fieldType === "string") { 
                        type = "str" 
                    }
                    else if (fieldType === "integer") {
                        type = "int"
                    }
                    else if (fieldType === "boolean") {
                        type = "bool"
                    }

                    args.push({
                        arg_name: fieldValue,
                        arg_type: type
                    })
                }
            }
        }
    }

    return args
}

export {
    constructTree,
    generateCode,
    getActionArguments
}