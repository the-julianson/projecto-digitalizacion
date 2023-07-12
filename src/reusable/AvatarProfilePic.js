import { Avatar } from "@mui/material";
import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
// import { UserContext } from "../../context/UserContext";
// import clientsService from "../../services/users.service";

export default function AvatarProfilePic(props) {
    const { size = 40 } = props;
    // const { getUserInfo } = useContext(UserContext);
    const [imagen, setImagen] = useState(() => "");

    async function getProfilePic() {
        let finalIdUsuario;
        if (props.currentUser) {
            // let usuario = await getUserInfo();
            // finalIdUsuario = usuario.idUsuario;
        } else {
            finalIdUsuario = props.idUsuario;
        }

        // const response = await clientsService.getUserAvatar(finalIdUsuario);

        // if (response instanceof AxiosError) {
        //     console.log(response); // TODO IMPROVE
        // } else {
        //     setImagen(response);
        // }
    }

    useEffect(() => {
        getProfilePic();
    }, []);

    return <Avatar src={imagen} sx={{ width: size, height: size }} />;
}
