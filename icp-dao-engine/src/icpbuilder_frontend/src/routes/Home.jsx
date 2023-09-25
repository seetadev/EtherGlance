import * as React from "react";
// import { custom_greeting_backend } from "../../declarations/custom_greeting_backend";
import "../../assets/home.css";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

const Home = () => {
    const [name, setName] = React.useState('');
    const [message, setMessage] = React.useState('');

    async function doGreet() {
        // const greeting = await custom_greeting.greet(name);
        setMessage("greeting");
    }

    return (
        <div>
            <Navbar />
            <Hero />
        </div>
    );
};

export default Home