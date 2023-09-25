import * as React from "react";
import "../../assets/dashboard.css";
import Navbar from "../components/Navbar";
import AppsTable from "../components/AppsTable";
import { Container, Heading, Stack, FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import { icpbuilder } from "../../../declarations";
// import { custom_greeting_backend } from "../../declarations/custom_greeting_backend";

const NewApp = () => {
    const [loggedIn, setLoggedIn] = React.useState(false)
    const [actor, setActor] = React.useState(icpbuilder)
    const [appName, setAppName] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    const toast = useToast()

    React.useEffect(() => {
        if (localStorage.getItem("user-id") && /^\d+$/.test(localStorage.getItem("user-id"))) {
            setLoggedIn(true)
        }
    }, [])

    const createApp = async () => {
        setLoading(true)
        const userId = parseInt(localStorage.getItem("user-id"))
        await actor.create_app(userId, appName)
        setAppName("")
        toast({
            title: "New application created.",
            description: "We've created your application for you.",
            status: "success",
            duration: 4000,
            isClosable: true
        })
        setLoading(false)
    }

    return (
        <div>
            <Navbar />
            {(loggedIn ? (
                <Container maxW={'7xl'}>
                    <Stack
                        align={'left'}
                        spacing={{ base: 8, md: 10 }}
                        py={{ base: 20, md: 20 }}>
                        <Heading>New App</Heading>
                        <FormControl id="app-name" isRequired>
                            <FormLabel>App Name</FormLabel>
                            <Input
                                value={appName}
                                onChange={e => setAppName(e.target.value)}
                                placeholder="App Name"
                                _placeholder={{ color: 'gray.500' }}
                            />
                        </FormControl>
                        <Stack spacing={6}>
                            <Button
                                onClick={createApp}
                                bg={'orange.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'orange.500',
                                }}
                                isLoading={loading}>
                                Create App
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            ) : (
                <p>Please Log in</p>
            ))}
        </div>
    );
};

export default NewApp