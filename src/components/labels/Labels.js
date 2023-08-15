import React from "react";
import {Paper, Stack} from "@mui/material";
import TitleCard from "../../reusable/card/TitleCard";
import Tabs from "../../reusable/Tabs";
import CreateBatchForm from "./CreateBatchForm";
// import ReprintBatchForm from "./ReprintBatchForm";
import UnderConstruction from "../../reusable/UnderConstruction";

function Labels() {
  return (
    <Stack
      width="100vw"
      flexDirection="column"
      justifyContent="center"
      sx={{mt: "30px", alignItems: 'center'}}
    >
      <TitleCard
        title="Etiquetas"
        subtitle="Creacion e impresion de etiquetas"
        width="60vw"
        sx={{marginY: "auto"}}
      >
        <Paper elevation={3} sx={{width: "80%", mb: 5}}>
          <Tabs
            indexes={[0, 1]}
            labels={["Crear lote nuevo", "Reimprimir etiquetas"]}
            activeTab={0}
          >
            <CreateBatchForm />
            {/* <ReimprimirLoteForm /> */}
            <UnderConstruction/>
          </Tabs>
        </Paper>
      </TitleCard>
    </Stack>
  );
} 

export default Labels;
