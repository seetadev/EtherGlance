import * as React from "react";
import "../../assets/dashboard.css";
import Navbar from "../components/Navbar";
import AppsTable from "../components/AppsTable";
import { Container, Heading, Stack } from "@chakra-ui/react";
import { icpbuilder } from "../../../declarations";

const Dashboard = () => {
    const [loggedIn, setLoggedIn] = React.useState(false)
    const [actor, setActor] = React.useState(icpbuilder)
    const [apps, setApps] = React.useState([])

    React.useEffect(() => {
        if (localStorage.getItem("user-id") && /^\d+$/.test(localStorage.getItem("user-id"))) {
            setLoggedIn(true)
            const userId = parseInt(localStorage.getItem("user-id"))
            actor.get_user(userId)
                .then(res => {
                    if (res.length > 0) {
                        console.log(res[0].user_apps)
                        for (const _app in res[0].user_apps) {
                            actor.get_app(parseInt(_app))
                                .then(_res => {
                                    setApps(prev => [...prev, _res[0]])
                                })
                        }
                    }
                })
        }
    }, [])

    return (
        <div>
            <Navbar />
            {(loggedIn ? (
                <Container maxW={'7xl'}>
                    <Stack
                        align={'left'}
                        spacing={{ base: 8, md: 10 }}
                        py={{ base: 20, md: 20 }}>
                        <Heading>Your Apps</Heading>
                        <br />
                        <AppsTable applications={apps} />
                    </Stack>
                </Container>
            ) : (
                <p>Please Log in</p>
            ))}
        </div>
    );
};

export default Dashboard