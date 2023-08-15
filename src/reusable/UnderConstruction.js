import React from "react";
import UnderConstructionImage from "../images/underConstructionMediumSize.jpg";
import {Box, Stack} from "@mui/material";

function UnderConstruction() {
  return (
    <Stack sx={{flexDirection:'row', justifyContent:'center'}}>
    <img
      src={UnderConstructionImage}
      style={{width: "25vw", height: "25vw"}}
      alt="Page under construction"
    />
    </Stack>
  );
}

export default UnderConstruction;
