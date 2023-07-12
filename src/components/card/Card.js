import {Box, Paper, Stack, Typography} from "@mui/material";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import {Link, useNavigate} from "react-router-dom";

function Card({title, subtitle, description, url}) {
  const navigate = useNavigate();
  const handleClick = (url) => {
    navigate(url);
  };

  return (
    <Paper
      elevation={12}
      sx={{
        width: "400px",
        height: "180px",
        marginTop: "12px", // borrar esta prop
      }}
      onClick={() => {
        handleClick(url);
      }}
    >
      <Stack directrion="column" justifyContent={"space-between"}>
        <Stack direction="row" justifyContent={"space-between"} height="100px">
          <Paper
            elevation={6}
            sx={{
              width: "150px",
              height: "145px",
              position: "relative",
              top: "-60px",
              left: "22px",
              background: "linear-gradient(90deg, #67BF6B, #4BA64F)",
            }}
          >
            <Stack
              height="100%"
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <HomeIcon sx={{fontSize: "70px", color: "white"}} />
            </Stack>
          </Paper>
          <Box sx={{p: 2}}>
            <Typography variant={"h5"} textAlign={"end"} sx={{textDecoration: 'none'}}>
              {title}
            </Typography>
            <Typography variant={"b2"} textAlign={"end"}>
              {subtitle}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" height="80px" justifyItems="center">
          <Typography variant={"caption"} textAlign={"start"}>
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
    
  );
}

export default Card;
