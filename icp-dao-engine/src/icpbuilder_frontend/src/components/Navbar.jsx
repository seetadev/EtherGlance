import * as React from "react"
import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    Image,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { AuthClient } from "@dfinity/auth-client"
import { HttpAgent } from "@dfinity/agent";
import { createActor, icpbuilder } from "../../../declarations";

const Links = [
    { 
        name: 'Dashboard', 
        href: '/dashboard' 
    },
    { 
        name: 'New App', 
        href: '/new-app' 
    }
];

const NavLink = ({ children }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('orange.100', 'gray.700'),
        }}
        href={children.href}>
        {children.name}
    </Link>
);

export default function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [actor, setActor] = React.useState(icpbuilder)
    const [loggedIn, setLoggedIn] = React.useState(false)
    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        if (localStorage.getItem("user-id") && /^\d+$/.test(localStorage.getItem("user-id"))) {
            setLoggedIn(true)
            const userId = parseInt(localStorage.getItem("user-id"))
            actor.get_user(userId)
                .then(res => {
                    setUser(res[0])
                })
        }
    }, [])

    const login = async () => {
        let authClient = await AuthClient.create();

        await new Promise((resolve) => {
            authClient.login({
                identityProvider: process.env.II_URL,
                onSuccess: resolve,
            });
        });

        // At this point we're authenticated, and we can get the identity from the auth client:
        const identity = authClient.getIdentity();

        // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
        const agent = new HttpAgent({ identity });
        // Using the interface description of our webapp, we create an actor that we use to call the service methods. We override the global actor, such that the other button handler will automatically use the new actor with the Internet Identity provided delegation.
        const _actor = createActor(process.env.ICPBUILDER_CANISTER_ID, {
            agent,
        })
        setActor(_actor)
        const id = await actor.new_user()
        console.log(id)

        setLoggedIn(true)
        localStorage.setItem("user-id", id)
    }

    return (
        <>
            <Box bg={useColorModeValue('orange.50', 'orange.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box>
                            ICP Builder
                        </Box>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    {!loggedIn ? <Button onClick={login} colorScheme="orange">Log In</Button> : null}
                    {loggedIn ? <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                                backgroundColor={"orange.200"}>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://i.ibb.co/jHB1rmz/avatar-1.png'
                                    }
                                />
                            </MenuButton>
                            <MenuList>
                                <MenuItem>My Profile</MenuItem>
                                <MenuItem>Sign Out</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex> : null}
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}
