import { Button, Modal, ModalBody, FormControl, FormLabel, Input, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast, Select, Textarea } from "@chakra-ui/react"
import * as React from "react"
import { constructTree, getActionArguments } from "../utils/code"
import axios from "axios"

const Playground = ({ objects, actions, actor, isOpen, onClose, appName }) => {
    const [loading, setLoading] = React.useState(false)
    const [action, setAction] = React.useState(null)
    const [output, setOutput] = React.useState(null)
    const [actionArgs, setActionArgs] = React.useState([])
    const [args, setArgs] = React.useState([])
    const toast = useToast()

    const doAction = async (_action) => {
        let fields = {}
        for (let i = 0; i < objects.length; i++) {
            const field = await actor.get_fields_from_obj_id(objects[i].id)
            fields[objects[i].id] = field[0]
        }
        const tree = constructTree(actions, objects, fields)
        setAction(actions[parseInt(_action)])
        const actionArgs = getActionArguments(actions[parseInt(_action)], tree.objects)
        let _actionArgs = []
        for (let j = 0; j < actionArgs.length; j++) {
            _actionArgs.push({
                name: actionArgs[j].arg_name,
                type: actionArgs[j].arg_type,
                value: "",
            })
        }
        setArgs(_actionArgs)
    }

    const updateArgValue = (i, value) => {
        let _args = [...args]
        let arg = { ..._args[i] }
        arg.value = value
        _args[i] = arg
        setArgs(_args)
    }

    const run = async () => {
        setLoading(true)
        const res = await axios.post("http://localhost:3000/api/call_method", {
            project_name: appName,
            method: action.action_name,
            args
        })

        if (res.data.success) {
            setLoading(false)
            console.log(res.data)
            setOutput(res.data.output)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {
            onClose()
            setArgs([])
            setOutput(null)
        }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Playground</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Action</FormLabel>
                        <Select onChange={e => {
                            doAction(e.target.value)
                        }} placeholder='Choose Action'>
                            {actions ? actions.map((a, i) => (
                                <option value={i}>{a.action_name}</option>
                            )) : null}
                        </Select>
                    </FormControl>
                    {args.length > 0 ? args.map((arg, i) => (
                        <FormControl mt={5} isRequired>
                            <FormLabel>{arg.name}</FormLabel>
                            <Input onChange={e => updateArgValue(i, e.target.value)} value={arg.value} _placeholder={{ color: 'gray.500' }} placeholder={"Enter " + arg.name} />
                        </FormControl>
                    )) : null}
                    {output ? <Textarea mt={5} value={output} isDisabled /> : null}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => run()} isLoading={loading} colorScheme='orange' mr={3}>
                        Run
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Playground