import React, { useState, useEffect } from "react";
// import userService from "../../services/users.service";
import Typography from "@mui/material/Typography";

function UserInfo() {
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        const getUserInfo = async () => {
            // const user = await userService.getActiveUser();

            // setUserInfo(user);
        };
        getUserInfo();
    }, []);

    return (
        <div>
            <Typography variant="h6" color="initial" textAlign="center">
                {userInfo.nombre + " " + userInfo.apellido}
            </Typography>
            <Typography variant="body1" color="initial" gutterBottom>
                {/* {userInfo.mail} */} userInfo.mail esto es para traer del back
            </Typography>
        </div>
    );
}

export default UserInfo;
