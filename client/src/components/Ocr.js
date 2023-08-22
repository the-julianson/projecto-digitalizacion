
Home

import React, {  useState , useRef, useEffect} from "react";
import axios from 'axios'
import './App.css';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { Dialog } from 'primereact/dialog';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/arya-orange/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css'
import Papa from 'papaparse';
import AWS from './aws-config';
import { v4 as uuidv4 } from 'uuid';
import MaterialReactTable, {
  MaterialReactTableProps,
  MRT_Cell,
  //   MRT_Row,
  type MRT_ColumnDef
  //   type MRT_RowSelectionState
} from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
async function postImage({image, description}) {
  const formData = new FormData();
  formData.append("image", image)
  formData.append("description", description)

  //const result = await axios.post('http://localhost:8080/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})

  const result = await axios.post(`${process.env.REACT_APP_API_URL}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' }})
  return result.data
}

function App() {
    
  const [cargandoPDF, setCargandoPDF] = useState("");
  const [disponibleInformacionPDF, setDisponibleInformacionPDF] = useState(true);
  const [disponibleCargarPDF, setDisponibleCargarPDF] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [images, setImages] = useState([])
  const [file, setFile] = useState()
  const [fileName, setFileName] = useState()
  const [description, setDescription] = useState("")
  const [texto, setTexto] = useState("")
  const [requestId, setRequestId] = useState('');
  const [estadoPeticionPOST, setEstadoPeticionPOST] = useState('');
  const [position, setPosition] = useState('center');
  const [nombreFichero, setNombreFichero] = useState("")
  const [promptLicitacion,setPromptLicitacion] = useState("")
  const [impactadoenDynamo, setImpactadoenDynamo] = useState(false);
  const [Numero_Licitacion, setNumero_Licitacion] = useState("");
  const [Numero_Expediente, setNumero_Expediente] = useState("");
  const [Objeto, setObjeto] = useState("");
  const [Presupuesto_Total, setPresupuesto_Total] = useState("");
  const [Fecha_Venta_Pliego, setFecha_Venta_Pliego] = useState("");
  const [Fecha_Disponible_Recepcion_Consultas, setFecha_Disponible_Recepcion_Consultas] = useState("");
  const [Fecha_Entrega_Respuestas, setFecha_Entrega_Respuestas] = useState("");
  const [Fecha_Disponible_Recepcion_Ofertas,setFecha_Disponible_Recepcion_Ofertas] = useState("");
  const [Fecha_Apertura_Ofertas, setFecha_Apertura_Ofertas] = useState("");
  const [Valor_Pliego, setValor_Pliego] = useState("");
  const [displayDialogResultadosPDF, setDisplayDialogResultadosPDF] = useState(false);
  
  const dialogFuncMap = {
    'displayDialogResultadosPDF' : setDisplayDialogResultadosPDF
  }
  function mostrarDialogResultadosPDF(){
    onClick('displayDialogResultadosPDF')
  }
  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
        setPosition(position);
    }
}

  const renderFooter = (name) => {
    return (
        <div>
            
            <Button label="Continuar" icon="pi pi-check" onClick={() => onHide(name)} autoFocus />
        </div>
    );
  }
  const [data, setData] = useState([]);
  useEffect(() => {
    status_Proccess(0);
    const fetchData = async () => {
      const items = await getDataFromDynamoDB();
      setData(items);
    };

    fetchData(); // Asegúrate de pasar el requestId adecuado como argumento
  }, []);

  useEffect(() => {
    if (texto !== '') {
      setPromptLicitacion('Respondeme con los menor cantidad de caracteres posibles como si yo fuera un sistema que consume API y lee objetos JSONS . Debes buscar el valor solicitado con el siguiente formato, de respuesta  { "Nombre de la Variable": "Valor que encontraste"}. En caso de encontrar fechas, expresarlas como XX/XX/XXXX. Las variables son las siguientes, Numero_Licitacion,  Numero_Expediente, Objeto, Presupuesto_Total, Fecha_Venta_Pliego, Fecha_Disponible_Recepcion_Consultas, Fecha_Entrega_Respuestas, Fecha_Disponible_Recepcion_Ofertas, Fecha_Apertura_Ofertas y Valor_Pliego. El texto donde debes buscar es el siguiente: ' +
                          texto +
                          '.')
      
    }
    if (promptLicitacion !== ''){
      consultaLicitacion(promptLicitacion);
    }
    if (Numero_Licitacion !== ''){
      toastRefSuccess.current.show({ severity: 'success', summary: '3. Inicio Proceso Extracción de Información Relevante Finalizado.', detail: 'Procedimiento para obtención de Información relevante para el Modelo de Negocio Finalizado' });
    }

  }, [promptLicitacion, texto, Numero_Licitacion]);


    


  const toastRefSuccess= useRef(null);
  const toastRefError = useRef(null);
  const toastRefInfo= useRef(null);
  const fileUploadRef = useRef(null);
  const MAX_FILE_SIZE = 4990000;
  const onLoadingClick1 = () => {
    setCargandoPDF("true");
 }
 const disponibleCargar = () => {
  setDisponibleCargarPDF(false);
  
}
const onHide = (name) => {
  dialogFuncMap[`${name}`](false);
}

// [Fede]: Al seleccionar valida el tamaño del archivo seleccionado, si es menor que 5MB lo deja disponible 
// para cargar (aunque lo setea false ver) y carga otros datos necesarios en los estados
const fileSelected = event => {
  const file = event.originalEvent.target.files[0];
  if (file.size > MAX_FILE_SIZE) {
    toastRefError.current.show({
      severity: 'error',
      summary: 'Error',
      detail: 'No se permite archivos superiores a 4,99MB.',
    });
    fileUploadRef.current.value = null;
    return; // Detiene la función en caso de error
  }
  disponibleCargar();
  
  setFile(file);
  setFileName(event.originalEvent.target.files[0].name);
  console.log(event.originalEvent.target.files[0].name);
};

// [Fede]: Esto me parece que deberia ir en el back. La unica duda es que no se como funciona
  const saveDataToDynamoDB = async () => {
    // Reemplaza 'your-table-name' con el nombre de tu tabla en DynamoDB
    const tableName = 'licitaciones-berazategui';
    const docClient = new AWS.DynamoDB.DocumentClient();

    // Genera un ID único con 'uuid'
    const uniqueId = uuidv4();
    const enlaceDescarga = "https://licitaciones-berazategui.s3.us-east-1.amazonaws.com/"+fileName
    // Obtiene la fecha y hora actual
    const fechaAlta = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    // Prepara el objeto con los datos que deseas guardar
    const item = {
      id: uniqueId,
      fechaAlta,
      fileName,
      texto,
      Numero_Licitacion,
      Numero_Expediente,
      Objeto,
      Presupuesto_Total,
      Fecha_Venta_Pliego,
      Fecha_Disponible_Recepcion_Consultas,
      Fecha_Entrega_Respuestas,
      Fecha_Disponible_Recepcion_Ofertas,
      Fecha_Apertura_Ofertas,
      Valor_Pliego,
      enlaceDescarga
    };

    const params = {
      TableName: tableName,
      Item: item
    };

    try {
      const result = await docClient.put(params).promise();
      console.log('Dato guardado en DynamoDB:', result);
      toastRefSuccess.current.show({ severity: 'success', summary: 'Guardando en BD con Exito.', detail: 'Podra Actualizar la pagina o la tabla para ver la nueva novedad', life: 5000 });
    } catch (error) {
      console.error('Error al guardar en DynamoDB:', error);
    }
  };

  const getDataFromDynamoDB = async () => {
    const tableName = 'licitaciones-berazategui';
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
      TableName: tableName,
    };
  
    try {
      const result = await docClient.scan(params).promise();
      return result.Items;
    } catch (error) {
      console.error('Error al obtener datos de DynamoDB:', error);
      return [];
    }
  };
  

  const handleButtonClick = async () => {
    await saveDataToDynamoDB();
    toastRefInfo.current.show({ severity: 'info', summary: 'Guardando en BD', detail: 'Se guardara como fila toda la información contenida en esta ventana, incluido el link de descarga del fichero pdf', life: 5000 });
  };
const exportToCSV = () => {
  const data = [
    {
      NombreFichero: fileName,
      TextoResultante: texto.replace("\n", " "),
      NumeroLicitacion : Numero_Licitacion,
      NumeroExpediente: Numero_Expediente,
      Objeto: Objeto,
      PresupuestoTotal:Presupuesto_Total,
      FechaVentaPliego: Fecha_Venta_Pliego,
      FechaDisponibleRecepcionConsultas: Fecha_Disponible_Recepcion_Consultas,
      FechaEntregaRespuestas: Fecha_Entrega_Respuestas,
      FechaDisponibleRecepcionOfertas: Fecha_Disponible_Recepcion_Ofertas,
      FechaAperturaOfertas: Fecha_Apertura_Ofertas,
      ValorPliego: Valor_Pliego,
      LinkDescarga: "https://licitaciones-berazategui.s3.us-east-1.amazonaws.com/"+fileName
  
    },
  ];

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', "export_"+fileName.replace(".pdf","")+'.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const consultaLicitacion = async (promptFechaCeleb) => {
  const apiUrl = 'https://umbyq9pq95.execute-api.us-east-1.amazonaws.com/devGPTFechaCeleb';
  toastRefInfo.current.show({ severity: 'info', summary: '3. Inicio Proceso Extracción de Información Relevante.', detail: 'Procedimiento para obtención de Información relevante para el Modelo de Negocio', life: 5000 });
  try {
    //setFechaCelebCounter(0);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: promptFechaCeleb }),
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    const data = await response.json();
    console.log(data);

    const responseText = data.body.response;
    console.log(responseText);

    console.log("El responseText es:", responseText);
    const responseBody = parseResponseToJSON(responseText);
    console.log("El responseBody es:", responseBody);

    const V_Numero_Licitacion = responseBody.Numero_Licitacion;
    console.log("El numero de Licitacion es: " + V_Numero_Licitacion);
    const V_Numero_Expediente = responseBody.Numero_Expediente;
    const V_Objeto = responseBody.Objeto;
    const V_Presupuesto_Total = responseBody.Presupuesto_Total;
    const V_Fecha_Venta_Pliego = responseBody.Fecha_Venta_Pliego;
    const V_Fecha_Disponible_Recepcion_Consultas = responseBody.Fecha_Disponible_Recepcion_Consultas;
    const V_Fecha_Entrega_Respuestas = responseBody.Fecha_Entrega_Respuestas;
    const V_Fecha_Disponible_Recepcion_Ofertas = responseBody.Fecha_Disponible_Recepcion_Ofertas;
    const V_Fecha_Apertura_Ofertas = responseBody.Fecha_Apertura_Ofertas;
    const V_Valor_Pliego = responseBody.Valor_Pliego;
    if (responseBody) {
      setNumero_Licitacion(V_Numero_Licitacion);
      setNumero_Expediente(V_Numero_Expediente);
      setObjeto(V_Objeto);
      setPresupuesto_Total(V_Presupuesto_Total);
      setFecha_Venta_Pliego(V_Fecha_Venta_Pliego);
      setFecha_Disponible_Recepcion_Consultas(V_Fecha_Disponible_Recepcion_Consultas);
      setFecha_Entrega_Respuestas(V_Fecha_Entrega_Respuestas);
      setFecha_Disponible_Recepcion_Ofertas(V_Fecha_Disponible_Recepcion_Ofertas);
      setFecha_Apertura_Ofertas(V_Fecha_Apertura_Ofertas);
      setValor_Pliego(V_Valor_Pliego);
      setCargandoPDF(false);
      setDisponibleInformacionPDF(false);
    } else {
      setNumero_Licitacion("NO ENCONTRADO");
      setNumero_Expediente("NO ENCONTRADO");
      setObjeto("NO ENCONTRADO");
      setPresupuesto_Total("NO ENCONTRADO");
      setFecha_Venta_Pliego("NO ENCONTRADO");
      setFecha_Disponible_Recepcion_Ofertas("NO ENCONTRADO");
      setFecha_Apertura_Ofertas("NO ENCONTRADO");
      setValor_Pliego("NO ENCONTRADO");
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    // Aquí puedes mostrar un mensaje de error al usuario, por ejemplo
  }
};

function parseResponseToJSON(responseText) {
  const regex = /"(\w+)":\s*"((?:[^"\\]|\\.)*)"/g;
  let match;
  let obj = {};

  while ((match = regex.exec(responseText)) !== null) {
    const key = match[1];
    const value = match[2];
    obj[key] = value;
  }

  return obj;
}











const status_Proccess = async (requestId) => {
  if (requestId === 0) {
      return;
    }
      return new Promise(async (resolve) => {
        const response = await fetch("https://u6yummbbxa.execute-api.us-east-1.amazonaws.com/devStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ request_id: requestId }),
        });
    
        const data = await response.json();
        console.log(data);
    
        if (JSON.parse(data.body).message === 'TexTract en Proceso') {
          setEstadoPeticionPOST(JSON.parse(data.body).message);
          toastRefSuccess.current.show({ severity: 'success', summary: '1. PDF Subido con Exito.', detail: 'PDF en Servidor' });
          setTimeout(async () => {
            await status_Proccess(requestId);
          }, 5000);
        }
        else if(JSON.parse(data.body).message === 'TexTract JOBIDSTATUS') {
          console.log('Status POST:', JSON.parse(data.body).message);
          toastRefInfo.current.show({ severity: 'info', summary: '2. PDF a Texto Plano En Proceso.', detail: 'Transformación de imagen a texto plano en proceso' });
          setTimeout(async () => {
            await status_Proccess(requestId);
          }, 3000);
          console.log(JSON.parse(data.body).extracted_text);
        }
        else if(JSON.parse(data.body).message === 'TexTract Completado') {
          console.log('Status POST:', JSON.parse(data.body).message);
          toastRefSuccess.current.show({ severity: 'success', summary: '2. Texto Plano Realizado con Exito.', detail: 'Transformación de imagen a texto plano concretado con Exito' });
          setTexto(JSON.parse(data.body).extracted_text);
          console.log(JSON.parse(data.body).extracted_text);
          
          resolve(); // Resuelve la promesa aquí
        }
        else if(JSON.parse(data.body).message === 'Expresiones Regulares Listo') {
          console.log('Status POST:', JSON.parse(data.body).message);
          toastRefSuccess.current.show({ severity: 'success', summary: '3. Algoritmos de Extracción de Valor Realizado con Exito.', detail: 'Busqueda de contenido relevante por medio de algoritmos realizado con Exito' });
          //await consultaFechaCeleb(promptFechaCeleb);
          console.log(data);
          setCargandoPDF(false);
          setDisponibleInformacionPDF(false);
          resolve(); // Resuelve la promesa aquí
        }
      });

    
  // { message: "En Proceso, Subiendo Archivo", process_id: "your-process-id" }
};


const textractPDF = async (requestId) => {
  // Reemplaza esta URL con la URL de tu API Gateway para la función Lambda del procedimiento 2
  const apiUrl = 'https://ve6nra7dq3.execute-api.us-east-1.amazonaws.com/prodGeneric';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request_id: requestId }),
    });

    const data = await response.json();
    console.log(data);
    

    toastRefInfo.current.show({ severity: 'info', summary: '2. Texto Plano En Proceso.', detail: 'Transformación de imagen a texto plano' });   
    console.log("JSON.PARSE: ",JSON.parse(data.body).request_id);
    console.log("ESTADO REQUESTID: ", requestId);
    await status_Proccess(JSON.parse(data.body).request_id);
    // toastRefSuccess.current.show({ severity: 'success', summary: '2. Texto Plano Realizado con Exito.', detail: 'Transformación de imagen a texto plano' });   
    // Aquí puedes procesar la respuesta y actualizar el estado de tu aplicación según sea necesario

  } catch (error) {
    console.error('Error en la solicitud:', error);
    // Aquí puedes mostrar un mensaje de error al usuario, por ejemplo
  }
};
const columns = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Fecha Alta', accessorKey: 'fechaAlta' },
  { header: 'Nombre Fichero', accessorKey: 'fileName' },
  //{ header: 'Texto', accessorKey: 'texto', show: false },
  { header: 'Número Licitación', accessorKey: 'Numero_Licitacion' },
  { header: 'Número Expediente', accessorKey: 'Numero_Expediente' },
  { header: 'Objeto', accessorKey: 'Objeto' },
  { header: 'Presupuesto Total', accessorKey: 'Presupuesto_Total' },
  { header: 'Fecha Venta Pliego', accessorKey: 'Fecha_Venta_Pliego' },
  { header: 'Fecha Disponible Recepción Consultas', accessorKey: 'Fecha_Disponible_Recepcion_Consultas' },
  { header: 'Fecha Entrega Respuestas', accessorKey: 'Fecha_Entrega_Respuestas' },
  { header: 'Fecha Disponible Recepción Ofertas', accessorKey: 'Fecha_Disponible_Recepcion_Ofertas' },
  { header: 'Fecha Apertura Ofertas', accessorKey: 'Fecha_Apertura_Ofertas' },
  { header: 'Valor Pliego', accessorKey: 'Valor_Pliego' },
  { header: 'Enlace Descarga', accessorKey: 'enlaceDescarga'}
];

  const CargarPDF = async event => {
    event.preventDefault()
    toastRefInfo.current.show({ severity: 'info', summary: '1. Subiendo PDF.', detail: 'Subiendo PDF a Servidor' });
    onLoadingClick1();
    const result = await postImage({image: file, description})
    setImages([result.image, ...images])
    try {
    const response= await  fetch(
    //   'https://mtdzv0u93k.execute-api.us-east-1.amazonaws.com/Production/ocr',
    'https://i78vrpen2c.execute-api.us-east-1.amazonaws.com/devStartProcess',
      {
      method: "POST",
      headers: {
          Accept : "application/json",
          "Content-Type": "application.json"
      },
      body : JSON.stringify(fileName)
      
      }
     
    );
    const data = await response.json();
    console.log(data);
    console.log(JSON.parse(data.body).message);
    if (JSON.parse(data.body).message === 'PDF en S3.') {
        setRequestId(JSON.parse(data.body).request_id);
        toastRefSuccess.current.show({ severity: 'success', summary: '1. PDF Subido con Exito.', detail: 'PDF en Servidor' });   
        await textractPDF(JSON.parse(data.body).request_id); // Realizar Peticion POST
      } else {
        console.error('Error en la subida:', JSON.parse(data.body).message);
    }
    console.log(requestId);
   
    }catch (error) {
        console.error(error);
        if (error.message === 'Endpoint request timed out') {
            setShowDialog(true)
        }
        
        
        // Aquí puedes mostrar un mensaje de error al usuario, por ejemplo
      }
      
  }
  return (
    <div className="App">
      <header className="App-header">
        <div  class="md:p-6 align-items-center "  >
        <Fieldset>
        <div class="p-fluid grid"> 
                <div class="field col-12 md:col-4">
                        <Toast ref={toastRefError} />
                        <FileUpload ref={fileUploadRef} mode="basic" cancelOptions="display: none"  skinSimple="true"   cancelLabel="Cancelar" chooseLabel="Seleccionar Archivo" uploadLabel="." onBeforeSelect={fileSelected}  />   
                </div>
                <div class="field col-12 md:col-4">
              <Button icon="pi pi-check" loading={cargandoPDF} disabled={disponibleCargarPDF} className="mr-3 p-button-raised  "  label="Cargar"   type="button"  onClick={CargarPDF}></Button>                </div>
              <Toast ref={toastRefInfo} />
              <Toast ref={toastRefSuccess} />
                <div class="field col-12 md:col-4">
            <Button icon="pi pi-plus" label="Ver Información" disabled={disponibleInformacionPDF}  type="button" onClick={() => mostrarDialogResultadosPDF()} />
                <Dialog header="Resultado PDF" visible={displayDialogResultadosPDF} onHide={() => onHide('displayDialogResultadosPDF')} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}} footer={renderFooter('displayDialogResultadosPDF')}>
                        <b> {nombreFichero} </b>
                        <b> Texto Resultante: </b>
                        <p>{texto}</p>
                        <b> Numero Licitacion: </b>
                        <p>{Numero_Licitacion}</p>
                        <b> Numero Expediente: </b>
                        <p>{Numero_Expediente}</p>
                        <b> Objeto: </b>
                        <p>{Objeto}</p>
                        <b> Presupuesto Total: </b>
                        <p>{Presupuesto_Total}</p>
                        <b> Fecha Venta Pliego: </b>
                        <p>{Fecha_Venta_Pliego}</p>
                        <b> Fecha Disponible Recepción Consultas: </b>
                        <p>{Fecha_Disponible_Recepcion_Consultas}</p>
                        <b> Fecha Entrega Respuestas: </b>
                        <p>{Fecha_Entrega_Respuestas}</p>
                        <b> Fecha Disponible Recepcion Ofertas: </b>
                        <p>{Fecha_Disponible_Recepcion_Ofertas}</p>
                        <b> Fecha Apertura Ofertas: </b>
                        <p>{Fecha_Apertura_Ofertas}</p>
                        <b> Valor Pliego: </b>
                        <p>{Valor_Pliego}</p>

                        {/* <b> Valores Contrato: </b>
                        <p>{valoresContrato.join('- ')}</p> */}
                        {/* <b> Valores Quintales Soja: </b>
                        <p>{valoresQuintales !== "" ? valoresQuintales : "No se pudo encontrar la cantidad de toneladas de soja en el texto."}</p>
                        <b> Valores Toneladas:</b>
                        <p>{valoresToneladas}</p> */}

                        {/*<b> Direcciones: </b>
                        <p>{direcciones}</p>    */}
                        <Button  type="button" onClick={exportToCSV}>Exportar a CSV</Button>
                        <Button  type="button" onClick={handleButtonClick}>Guardar en BD</Button>
                </Dialog>
                

            </div>
            </div>
         </Fieldset>
        </div>  
      <div style={{ width: '50%', height: '500px', overflowX: 'auto' }}>
      <MaterialReactTable
        localization={MRT_Localization_ES}
        title="Datos de DynamoDB"
        initialState={{ density: 'compact' }}
        columns={columns}
        data={data}
        options={{
          pageSize: 10, // Cambia este valor para ajustar la cantidad de filas por página
          pageSizeOptions: [5, 10, 20], // Cambia estos valores para ajustar las opciones de filas por págin
          bordered: true
        }}
      />
      </div>
      </header>
    </div>
  );
}

export default App;

Terms of Service Privacy Policy Contact Us Feedback
© 2023
