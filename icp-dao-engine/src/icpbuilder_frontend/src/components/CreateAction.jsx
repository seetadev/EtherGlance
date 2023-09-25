import { Button, Modal, ModalBody, FormControl, FormLabel, Input, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast, Select } from "@chakra-ui/react"
import * as React from "react"

const CreateAction = ({ objId, setActions, actor, isOpen, onClose, appId }) => {
    const [actionName, setActionName] = React.useState("")
    const [actionType, setActionType] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const toast = useToast()

    const createAction = async () => {
        setLoading(true)
        console.log(objId)
        await actor.create_action(actionName, actionType, objId, appId)
        setActionName("")
        toast({
            title: "New action created.",
            description: "We've created your action for you.",
            status: "success",
            duration: 4000,
            isClosable: true
        })
        setLoading(false)

        actor.get_actions_from_app_id(appId)
            .then(_res => {
                setActions(_res[0])
            })
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {
            onClose()
        }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a New Action</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="action-name" isRequired>
                        <FormLabel>Action Name</FormLabel>
                        <Input
                            value={actionName}
                            onChange={e => setActionName(e.target.value)}
                            placeholder="Action Name"
                            _placeholder={{ color: 'gray.500' }}
                        />
                    </FormControl>
                    <FormControl mt={5} id="action-type" isRequired>
                        <FormLabel>Action Type</FormLabel>
                        <Select onChange={e => setActionType(e.target.value)} placeholder='Action Type'>
                            <option value='get-one'>Get One</option>
                            <option value='get-all'>Get All</option>
                            <option value='set'>Set</option>
                            <option value='delete'>Delete</option>
                        </Select>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={createAction} isLoading={loading} colorScheme='orange' mr={3}>
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CreateAction