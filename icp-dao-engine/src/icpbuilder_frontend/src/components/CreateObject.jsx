import { Button, Modal, ModalBody, FormControl, FormLabel, Input, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast, Select } from "@chakra-ui/react"
import * as React from "react"

const CreateObject = ({ setObjects, actor, isOpen, onClose, appId }) => {
    const [objName, setObjName] = React.useState("")
    const [fields, setFields] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const toast = useToast()

    const createObject = async () => {
        setLoading(true)
        const objId = await actor.create_object(objName, appId)

        for (let i = 0; i < fields.length; i++) {
            await actor.create_field(fields[i].name, fields[i].type, parseInt(objId))
        }
        setObjName("")
        toast({
            title: "New object created.",
            description: "We've created your object for you.",
            status: "success",
            duration: 4000,
            isClosable: true
        })
        setLoading(false)

        actor.get_objects_from_app_id(appId)
            .then(_res => {
                setObjects(_res[0])
            })
    }

    const createField = () => {
        setFields(fields.concat([{
            name: "",
            type: ""
        }]))
    }

    const updateFieldName = (i, name) => {
        let _fields = [...fields]
        let field = { ..._fields[i] }
        field.name = name
        _fields[i] = field
        setFields(_fields)
    }

    const updateFieldType = (i, typeOfField) => {
        let _fields = [...fields]
        let field = { ..._fields[i] }
        field.type = typeOfField
        _fields[i] = field
        setFields(_fields)
    }

    // React.useEffect(() => {
    //     console.log(fieldNames)
    // }, [fieldNames])

    return (
        <Modal isOpen={isOpen} onClose={() => {
            setFields([])
            onClose()
        }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a New Object</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl id="obj-name" isRequired>
                        <FormLabel>Object Name</FormLabel>
                        <Input
                            value={objName}
                            onChange={e => setObjName(e.target.value)}
                            placeholder="Object Name"
                            _placeholder={{ color: 'gray.500' }}
                        />
                    </FormControl>

                    {fields.map((f, i) => (
                        <>
                            <FormControl mt={5} id={"obj-name-" + i} isRequired>
                                <FormLabel>Field Name</FormLabel>
                                <Input
                                    value={fields[i].name}
                                    onChange={e => updateFieldName(i, e.target.value)}
                                    placeholder="Field Name"
                                    _placeholder={{ color: 'gray.500' }}
                                />
                            </FormControl>
                            <FormControl mt={5} id={"obj-type-" + i} isRequired>
                                <FormLabel>Field Type</FormLabel>
                                <Select onChange={e => updateFieldType(i, e.target.value)} placeholder='Field Type'>
                                    <option value='string'>Text</option>
                                    <option value='integer'>Number</option>
                                    <option value='boolean'>True/False</option>
                                </Select>
                            </FormControl>
                        </>
                    ))}
                    <Button mt={5} onClick={() => createField()}>+ New Field</Button>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={createObject} isLoading={loading} colorScheme='orange' mr={3}>
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CreateObject