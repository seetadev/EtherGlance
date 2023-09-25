import * as React from "react";
import "../../assets/dashboard.css";
import Navbar from "../components/Navbar";
import AppsTable from "../components/AppsTable";
import { Container, MenuItem, MenuList, Stack, FormControl, FormLabel, Input, Button, useToast, Flex, Box, Spacer, Text, useDisclosure, Heading } from "@chakra-ui/react";
import { icpbuilder } from "../../../declarations";
import { useNavigation, useParams } from "react-router-dom";
import CreateObject from "../components/CreateObject";
import { ContextMenu } from 'chakra-ui-contextmenu';
import CreateAction from "../components/CreateAction";
import { constructTree, generateCode } from "../utils/code";
import axios from "axios";
import Playground from "../components/Playground";

const Application = () => {
    const [loggedIn, setLoggedIn] = React.useState(false)
    const [actor, setActor] = React.useState(icpbuilder)
    const [objects, setObjects] = React.useState(null)
    const [actions, setActions] = React.useState(null)
    const [appName, setAppName] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    // This is the current object for which we are creating the action
    const [currentActionObject, setCurrentActionObject] = React.useState(null)

    let params = useParams();

    const { isOpen: isCreateObjectOpen, onOpen: onCreateObjectOpen, onClose: onCreateObjectClose } = useDisclosure()
    const { isOpen: isCreateActionOpen, onOpen: onCreateActionOpen, onClose: onCreateActionClose } = useDisclosure()
    const { isOpen: isPlaygroundOpen, onOpen: onPlaygroundOpen, onClose: onPlaygroundClose } = useDisclosure()

    React.useEffect(() => {
        if (localStorage.getItem("user-id") && /^\d+$/.test(localStorage.getItem("user-id"))) {
            setLoggedIn(true)
            // actor.get_app(parseInt(params.appId))
            //     .then(_res => {
            //         console.log(_res[0])
            //         setObjects(_res[0].app_objects)
            //     })

            actor.get_objects_from_app_id(parseInt(params.appId))
                .then(_res => {
                    setObjects(_res[0])
                })
            
            actor.get_actions_from_app_id(parseInt(params.appId))
                .then(_res => {
                    setActions(_res[0])
                })

            actor.get_app(parseInt(params.appId))
                .then(_res => {
                    setAppName(_res[0].app_name)
                })
        }
    }, [])

    const toast = useToast()

    // React.useEffect(() => { console.log(objects) }, [objects])

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/x-python;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    const exportProject = async () => {
        let fields = {}
        for (let i = 0; i < objects.length; i++) {
            const field = await actor.get_fields_from_obj_id(objects[i].id)
            fields[objects[i].id] = field[0]
        }
        const tree = constructTree(actions, objects, fields)
        const code = generateCode(tree)
        download("main.py", code)
    }

    const deploy = async () => {
        setLoading(true)
        let fields = {}
        for (let i = 0; i < objects.length; i++) {
            const field = await actor.get_fields_from_obj_id(objects[i].id)
            fields[objects[i].id] = field[0]
        }
        const tree = constructTree(actions, objects, fields)
        const code = generateCode(tree)

        const res = await axios.post("http://localhost:3000/api/deploy", {
            projectName: appName,
            code
        })
        if (res.data.success) {
            setLoading(false)
            toast({
                title: "App deployed.",
                description: "We've deployed your application for you.",
                status: "success",
                duration: 4000,
                isClosable: true
            })
        }
    }

    return (
        <div>
            <Navbar />
            {(loggedIn ? (
                <Container maxW={'7xl'}>
                    <Stack
                        align={'center'}
                        mt={20}
                        spacing={{ base: 8, md: 10 }}
                        h='400px'>
                        <Flex w='100%' h='100%'>
                            <Flex position="relative" py={10} justifyContent="center" alignItems="center" flexDirection="column" border="2px solid orange" borderRadius={20} w='30%' h='100%'>
                                {objects && objects.length > 0 ? objects.map(obj => (
                                    <ContextMenu
                                        renderMenu={() => (
                                            <MenuList>
                                                <MenuItem onClick={() => {
                                                    setCurrentActionObject(parseInt(obj.id))
                                                    onCreateActionOpen()
                                                }}>Create Action</MenuItem>
                                                <MenuItem color="red.600">Delete</MenuItem>
                                            </MenuList>
                                        )}>
                                        {ref => <Text ref={ref} fontSize={22} mb={10}>{obj.obj_name}</Text>}
                                    </ContextMenu>
                                )) : <Text color="gray.600" fontSize={22}>NO OBJECTS YET -_-</Text>}

                                <Button onClick={() => onCreateObjectOpen()} _hover={{
                                    backgroundColor: "orange.500"
                                }} h="50px" w="50px" fontSize="26px" color="white" backgroundColor="orange.600" borderRadius="50%" bottom="-6" position="absolute">+</Button>

                                <CreateObject setObjects={setObjects} actor={actor} appId={parseInt(params.appId)} isOpen={isCreateObjectOpen} onClose={onCreateObjectClose} />
                            </Flex>
                            <Spacer />
                            <Flex py={10} justifyContent="center" alignItems="center" flexDirection="column" border="2px solid orange" borderRadius={20} w='30%' h='100%'>
                                {actions && actions.length > 0 ? actions.map(action => (
                                    <ContextMenu
                                        renderMenu={() => (
                                            <MenuList>
                                                <MenuItem color="red.600">Delete</MenuItem>
                                            </MenuList>
                                        )}>
                                        {ref => <Text ref={ref} fontSize={22} mb={10}>{action.action_name}</Text>}
                                    </ContextMenu>
                                )) : <Text color="gray.600" fontSize={22}>NO ACTIONS YET -_-</Text>}

                                {/* <Flex color="white" flexDirection="column" justifyContent="center" backgroundColor="orange.600" mb={5} py={5} px={5}>
                                    <Text fontSize={22}>Action 3</Text>
                                </Flex> */}

                                <CreateAction objId={currentActionObject} setActions={setActions} actor={actor} appId={parseInt(params.appId)} isOpen={isCreateActionOpen} onClose={onCreateActionClose} />
                            </Flex>
                        </Flex>
                    </Stack>
                    <Flex mt={20} justifyContent="space-evenly" border="2px solid orange" borderRadius={20} h="180px" alignItems="center">
                        <Button onClick={() => exportProject()}>Export as Project</Button>
                        <Button isLoading={loading} onClick={() => deploy()}>Deploy</Button>
                        <Button onClick={() => onPlaygroundOpen()} colorScheme="orange">Playground</Button>
                        <Playground objects={objects} actions={actions} actor={actor} appName={appName} isOpen={isPlaygroundOpen} onClose={onPlaygroundClose} />
                    </Flex>
                </Container>
            ) : (
                <p>Please Log in</p>
            ))}
        </div>
    );
};

export default Application