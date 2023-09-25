# ICP DAO Engine

## Problem

The problem that ICP DAO Engine aims to solve is the lack of accessible tools and resources for non-technical individuals to create blockchain applications, hindering the widespread adoption of blockchain technology. This limits the potential for innovation and the integration of blockchain solutions across industries. By offering a no-code platform, individuals without programming skills can easily build blockchain applications, democratizing access and accelerating the adoption of blockchain technology in diverse sectors.

## Solution

To solve this problem, we built ICP DAO Engine, built using ICP Builder, a no-code app DAO Engine for the Internet Computer. With ICP DAO Engine, non-technical users can build blockchain apps and onboard new web2 members on the blockchain. Therefore, we can bring the masses to blockchain technology without necessarily being tech-savvy or understanding core blockchain technologies.

## Vision

Our main vision is to be able to onboard the next billion users on blockchain through no-code solutions which can reduce the barriers to adoption in blockchain.

## Philosophy

The goal of ICP DAO Engine is for web2 and web3 novice users to be able to build no-code apps without extra effort and no technical knowledge of the underlying software itself. We believe in the core ethos of blockchain technology which is decentralization and democratization. Following this belief, we have designed ICP DAO Engine to be completely decentralized and on-chain, which shows how we are practicing what we preach.

## How We Built It

We have built ICP DAO Engine using a mix of programming languages, frameworks and technologies, as follows:

- **React.js:** We used React.js as our choice of frontend framework, to build a reactive user experience. Working with React.js, we were able to easily build out our user interface, and a set up a quick prototype.

- **Flask:** We were also required to use a server component in our application when building out the deployment feature since we had to compile and deploy the canisters built using ICP DAO Engine on the server-side. With Flask, this was extremely easy and quick.

- **Kybra:** We used Kybra by Demergent Labs to compile and run our Python-based canisters on Internet Computer. Our experience with Kybra was quite pleasant. The library seemed pretty stable and the documentation was really useful for our purpose.

- **Python:** This was our language of choice for the canister code and the server-side program. For the canisters, we had a choice between many different languages, but we chose Python because it was really easy to get started with it and build a proof-of-concept in limited time. For the backend, Python was a no-brainer because our canister was also written in Python, so we just went with it.

- **JavaScript:** This was our language of choice for the frontend. As the language of the web, JavaScript was the obvious choice for implementing our frontend. Moreover, we thought about using JavaScript for our backend, but decided against it, since Python was much easier for us to work with.

## Future Roadmap

We plan on implementing the following features in ICP DAO Engine in the future:

- More Actions: Actions are what gives your application functionality. They are essentially, "functions" in the conventional sense. For now, we only have three types of actions - get all, get single and set. They encompass a subset of the CRUD operations (specifically create and read), which make up the basis for building modern applications. Therefore, we will add more actions like update and delete, for users to be able to build more sophisticated applications.

- Modes: We envision ICP DAO Engine to be adaptable and extensive, in that, more advanced learned users should be able to customize and build their applications at a lower level than other users who may not be so advanced. Keeping this in mind, we also want to release two different modes - advanced and basic. With advanced mode, users could add programming constructs like loops or conditionals, without worrying about the underlying syntax, thereby, giving them a lot more power over their own applications. A basic mode, on the other hand, becomes very simple, allowing users to build applications, without hassle, in a jiffy. This may include, removing data types from `Objects`, to decrease complexity.

- Multi-chain: Due to the vast number of blockchain ecosystems, the population using blockchain technology is split amongst these different ecosystems. In order to make blockchain apps accessible to the larger web3 community, ICP DAO Engine needs to support multiple blockchains, which will lead to chain-agnostic applications, and thus, a wide variety of users will be able to use apps built with ICP DAO Engine.

- Enhance UI/UX: The current user interface is very simple and minimalistic given the time period to develop the prototype, however, we do intend on customizing the design to be more intuitive and aesthetic. Furthermore, the current user experience for building an "application" using ICP DAO Engine is considerably unintuitive, especially for those who are non-technical, hence, we plan on changing our approach of building applications, to use flowcharts or block diagrams to represent the applications.

- Identities: ICP has a wonderful identity system for working with users and authentication. While one can login to ICP DAO Engine with their identity, applications built using ICP DAO Engine cannot yet leverage this system, so we definitely have this planned, to implement identities in applications.

## Getting Started

ICP DAO Engine is divided in three distinct components - the frontend, the backend and the canisters. Technically, the frontend itself is a canister, but we won't run it as a canister, we will use Webpack to bundle and run it. All the tooling is already configured. You need the following dependencies to run all the three components:
- node
- npm
- dfx
- python
- pyenv

**NOTE: For the server, you need to create a directory `data/` in the `src/server/` directory. Once created, the path should look like this: `src/server/data/`. This is where we store all user applications and their code.**

## Steps to Run

- Clone the repository with `git clone` and change directory to `icpdaoengine`

- Then install all dependencies with `npm i`

- *(Optional)* Also activate a virtual environment if you want to locally deploy the canisters (See more [here](https://demergent-labs.github.io/kybra/hello_world.html#the-project-directory-and-file-structure))

- Install Flask with `pip3 install flask` or `pip install flask` depending on your installation of python

- Now start a local replica as a backround process with `dfx start --background`

- Once everything is installed, start the frontend with `npm start`

- To start the server process, switch directory to `src/server/` and run `python3 main.py`

## Project Gallery


![ICP DAO Engine application page](https://i.ibb.co/XYN0x7m/Clean-Shot-2023-06-18-at-14-13-43-2x.png)

![ICP DAO Engine application playground](https://i.ibb.co/3m38LqL/Clean-Shot-2023-06-18-at-14-15-01-2x.png)