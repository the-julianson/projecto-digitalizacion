import React from "react";
import Card from "../card/Card";
import {Stack} from "@mui/material";

/* <Stack display='flex' flexDirection='row' justifyContent='space-around' height='100%' alignItems={'center'}> */
function Dashboard({cardsDataArray}) {


/* <Card key={index} title={title} subtitle={subtitle} description={description} onClick={()=>handleClick(url)}/> */
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        height: "80vh",
        alignItems: "center",
      }}
    >
      {cardsDataArray.map((cardData, index) => {
        const {title, subtitle, description, url} = cardData;
        return (
          <Card key={index} title={title} subtitle={subtitle} description={description} url={url}/>
        );
      })}
    </Stack>
  );
}

export default Dashboard;
