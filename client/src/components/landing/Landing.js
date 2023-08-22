// client/src/components/Landing.js

import React, {useState} from "react";
import TitleCard from "../../reusable/card/TitleCard";
import {Box, Button} from "@mui/material";
import Tabs from "../../reusable/Tabs";
import Login from "./LogIn";
import SignUp from "./SignUp";
// import { Button, ButtonGroup } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';

function Landing(props) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TitleCard
      title="Bienvenido a Nebula Software!"
      subtitle="Inicie sesión o registrese si aun no tiene usuario."
      width="60vw"
    >
      <Box width="60%" sx={{margin: "auto"}}>
        <Tabs
          indexes={[0, 1]}
          labels={["Iniciar sesión", "Registro"]}
          activeTab={activeTab}
        >
          <Login />
          <SignUp />
        </Tabs>
        <Button
          onClick={() => {
            setActiveTab(activeTab === 0 ? 1 : 0);
          }}
          fullWidth
        >
          {activeTab === 0
            ? "No tenes usuario aun?"
            : "Tenes usuario? Inicia sesión"}
        </Button>
        {/* {props.isLoggedIn ? ( */}
        {/* <></> */}
        {/* ) : ( */}
        {/* 
          <ButtonGroup>
          <LinkContainer to='/sign-up'>
          <Button data-cy="signUp">Sign up</Button>  
          </LinkContainer>
          <LinkContainer to='/log-in'>
          <Button data-cy="logIn">Log in</Button>
          </LinkContainer>
        </ButtonGroup> */}
      </Box>
    </TitleCard>
  );
}

export default Landing;
