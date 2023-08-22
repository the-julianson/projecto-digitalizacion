import {Box, Paper, Stack, Typography} from "@mui/material";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import {Link, useNavigate} from "react-router-dom";

function MenuCard({dataCy, title, subtitle, description, url, icon}) {
  const navigate = useNavigate();
  const handleClick = (url) => {
    navigate(url);
  };

  const Icon = () => {
    return icon;
  };

  return (
    <Paper
      data-cy={dataCy}
      elevation={12}
      sx={{
        width: "400px",
        height: "180px",
        // marginTop: "12px", // borrar esta prop
        cursor: "pointer",
        zIndex:"3",
      }}
      onClick={() => {
        handleClick(url);
      }}
    >
      <Stack directrion="column" justifyContent={"space-between"} height="100%">
        <Stack direction="row" justifyContent={"space-between"} height="100px">
          <Paper
            elevation={6}
            sx={{
              width: "130px",
              height: "115px",
              position: "relative",
              top: "-45px",
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
              <Icon />
            </Stack>
          </Paper>
          <Box sx={{p: 2}}>
            <Typography
              variant={"h5"}
              textAlign={"end"}
              sx={{textDecoration: "none"}}
            >
              {title}
            </Typography>
            <Typography paragraph variant={"b2"} textAlign={"end"}>
              {subtitle}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" justifyItems="center">
          <Typography
            paragraph
            color="grey"
            variant={"body2"}
            textAlign={"start"}
            margin
          >
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default MenuCard;
