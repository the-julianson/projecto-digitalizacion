import { AllInbox, Home, Person, QrCode2, Topic, Scanner } from "@mui/icons-material"

const dataHomeIconStyle = {sx:{fontSize: "70px", color: "white"}}

export const dataHomeCard = 
    [ 
        {
        title:'Digitalizacion', 
        subtitle:'Creación e Impresion de Etiquetas',
        description:'Creación de etiquetas y pasos, reimpresión de etiquetas',
        url:'/digitalization',
        icon:<Scanner {...dataHomeIconStyle}/>,
        dataCy:'digitalization'
    },
    {
        title:'Documentos', 
        subtitle:'Visualización de Lotes',
        description:'Visualización y modificación de estado, de documentos correspondientes al lote de una fecha.',
        url:'/documents',
        icon:<Topic {...dataHomeIconStyle}/>
    },
    {
        title:'Gestion de Usuarios', 
        subtitle:'Visualización de Lotes',
        description:'Visualización y modificación de estado, de documentos correspondientes al lote de una fecha.',
        url:'/gestionDeUsuarios',
        icon:<Person {...dataHomeIconStyle}/>
        }
    
]


export const dataDigitalizationCard = 
    [ 
        {
        title:'Etiquetas', 
        subtitle:'Creación e impresion de etiquetas',
        description:'Crear etiquetas y pasos, reimprimir etiquetas',
        url:'labels',
        icon:<QrCode2 {...dataHomeIconStyle}/>,
        dataCy:'labels'
    },
    {
        title:'Lotes', 
        subtitle:'Visualización de Lotes',
        description:'Consultar documentos por fecha y modificar su estado',
        url:'lotes',
        icon:<AllInbox {...dataHomeIconStyle}/>,
        dataCy:'lotes'
        }
    
]

