import React, { useState, useEffect } from "react";
// import userService from "../../services/users.service";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import AvatarProfilePic from "../AvatarProfilePic";


function UserInfo() {
    const {email} = useSelector(state=>state.auth.activeUser)
    useEffect(() => {
       
    }, []);

    return (
        <>
        <AvatarProfilePic/>
            <Typography variant="b2" color="initial" textAlign="center" multiline rows={2}>
                {/* {userInfo.nombre + " " + userInfo.apellido} */}
                ver que pasa con el username
            </Typography>
            <Typography variant="caption" color="initial" gutterBottom>
            {email}
            </Typography>
        </>
    );
}

export default UserInfo;
