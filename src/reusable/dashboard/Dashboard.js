import React from "react";
import MenuCard from "../card/MenuCard";
import {Box, Stack} from "@mui/material";

/* <Stack display='flex' flexDirection='row' justifyContent='space-around' height='100%' alignItems={'center'}> */
function Dashboard({cardsDataArray}) {
  /* <Card key={index} title={title} subtitle={subtitle} description={description} onClick={()=>handleClick(url)}/> */
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center", // Cambiado de "space-around" a "center"
        alignItems: "center",
        // maxWidth: "80vw", // Cambiado a "90vw" para evitar que los elementos se salgan en pantallas pequeñas
        padding: "20px",
        marginTop: "50px"
        
      }}
    >
      <Stack
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: {xs: "column", md: "row"},
          justifyContent: "center", // Cambiado de "space-around" a "center"
          alignItems: "center",
          maxWidth: "90vw", // Cambiado a "90vw" para evitar que los elementos se salgan en pantallas pequeñas
          // width: "100%"
          spacing: {
            xs: 8, // Espaciado de 8 para xs (extra pequeño)
            md: 0, // Espaciado de 0 para md (mediano)
          },
        }}
        // spacing='xs:8, md:0' // Añadido espacio entre los elementos
      >
        {cardsDataArray.map((cardData, index) => {
          const {title, subtitle, description, url, icon, dataCy} = cardData;
          return (
            <Box
            sx={{
                marginBottom: 8,
                marginX:6
                }
              }>
              <MenuCard
                key={index}
                title={title}
                subtitle={subtitle}
                description={description}
                url={url}
                icon={icon}
                dataCy={dataCy}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

export default Dashboard;
