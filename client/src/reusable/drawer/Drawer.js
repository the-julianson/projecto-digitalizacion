import { useState, useEffect} from "react";
import {styled, useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import {
  AdminPanelSettings,
  FolderCopy,
  Home,
  ListAlt,
  Lock,
  Logout,
  Mail,
  Person,
  Receipt,
  SquareFoot,
  Timeline,
  Scanner,
  SupportAgent,
} from "@mui/icons-material";
import edificio from "../../images/edificio.jpg";
import AvatarProfilePic from "../AvatarProfilePic";
import DrawerItem from "./DrawerItem";
import {Stack} from "@mui/material";
// import UserInfo from "./UserInfo";
import { useDispatch, useSelector } from "react-redux";

import { loggingOut } from "../../states/authState";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Main = styled("main", {shouldForwardProp: (prop) => prop !== "open"})(
  ({theme, open}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

export const menuItem = [
  {
    text: "Inicio",
    icon: <Home />,
    url: "/home",
    permiso: "",
  },
  {
    text: "Digitalizacion",
    icon: <Scanner />,
    url: "/digitalization",
    permiso: "",
  },
  {
    text: "Documentos",
    icon: <FolderCopy />,
    iconName: "Mail",
    url: "/documentos",
    permiso: "mis-planes",
    descripcion: "Entra al plan que tenes vigente y entrena!",
  },
  {
    text: "Gestion de Usuarios",
    icon: <Person />,
    iconName: "FolderCopy",
    url: "/gestionDeUsuarios",
    permiso: "mis-planes",
    descripcion: "Revisa los planes que finalizaste y los que vienen",
  },
];

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {isLoggedIn} = useSelector(state=>state.auth)
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

 useEffect(()=>{
navigate(isLoggedIn?'./home':'./landing')
 },[isLoggedIn])

  return (
    <Box sx={{display: "flex"}}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{mr: 2, ...(open && {display: "none"})}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Nebula Software ({process.env.REACT_APP_ENVIRONMENT_TYPE})
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Stack width="100%" direction="column" alignItems="start" sx={{m:2}}>
          
            {/* <UserInfo/> */}
            <Typography variant="b2">UserNameHardcoded</Typography>
            <Typography variant="caption">Email hardcoded</Typography>
          </Stack>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItem.map((item, index) => (
            <DrawerItem
              key={item.text}
              text={item.text}
              icon={item.icon}
              handleDrawerClose={handleDrawerClose}
              url={item.url}
            />
            /* <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem> */
          ))}
        </List>
        <Divider />

        <List>
        <Stack direction='column' justifyContent={'center'} width='100%'>
            <ListItem key={'Soporte'} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                 <SupportAgent/>
                </ListItemIcon>
                <ListItemText primary={'Soporte'} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'Cerrar sesión'} disablePadding>
              <ListItemButton onClick={()=>{
                dispatch(loggingOut())
                handleDrawerClose()
                }}>
                <ListItemIcon>
                 <Logout/>
                </ListItemIcon>
                <ListItemText primary={'Cerrar sesión'} />
              </ListItemButton>
            </ListItem>
        </Stack>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
      {open && (
                <Box
                    id="closebox"
                    sx={{
                        backgroundColor: "#000000",
                        opacity: "0.5",
                        width: "100vw",
                        height: "100vh",
                        zIndex: "255",
                        position: "absolute",
                        left: "0vw",
                    }}
                    onClick={handleDrawerClose}
                    // onWheel={handleWheel}
                ></Box>
            )}
    </Box>
  );
}
