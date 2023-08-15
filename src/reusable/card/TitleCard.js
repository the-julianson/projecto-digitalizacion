import {Box, Paper, Stack, Typography} from "@mui/material";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import {useNavigate} from "react-router-dom";


function TitleCard({title, subtitle, width, children}) {
  const navigate = useNavigate();
  const handleClick = (url) => {
    navigate(url);
  };

  return (
      <Paper
        elevation={12}
        sx={{
          width: width,
          marginX:'auto',
          // marginY:'0px'
          zIndex:'3'
        }}
      >
        <Stack directrion="column" justifyContent={"space-between"}>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            height="100px"
          >
            <Paper
              elevation={6}
              sx={{
                width: "95%",
                height: "90px",
                position: "relative",
                marginX:'auto',
                top: "-25px",
                
                background: "linear-gradient(90deg, #67BF6B, #4BA64F)",
                paddingLeft: 2,
              }}
            >
              <Stack
                height="100%"
                direction="column"
                justifyContent="center"
                alignItems="start"
              >
                <Typography color="white" variant={"h6"} textAlign={"end"}>
                  {title}
                </Typography>

                <Typography color="white" variant={"caption"} textAlign={"end"}>
                  {subtitle}
                </Typography>
              </Stack>
            </Paper>
            <Stack direction="row" height="80px" justifyItems="center">
              <Typography variant={"caption"} textAlign={"start"}></Typography>
            </Stack>
          </Stack>
          <Stack direction='row' justifyContent='center'>
          {children}
          </Stack>
        </Stack>
      </Paper>
  );
}

export default TitleCard;
