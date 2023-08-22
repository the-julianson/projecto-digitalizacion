import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {UseSelector} from "react-redux/es/hooks/useSelector";
const axiosBase = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// TODO GDD-57
// Solicitudes iniciales fallidas
// Gestion de incidencia:
// Solicitudes iniciales fallidas
// Fallo en el envio de bearer token en la primer peticion posterior al login.
//
// Hacer un hook que use useSelector ya que aca (axiosBase) no se puede hacer porque
// no es un compoenente de react. El mismo en primera instancia buscara
// el bearer token en el state y se lo va a pasar a esta funcion, y si no pasa
// nada esta funcion la busca en el almacenamiento, y si tampoco esta en el
// almacenamiento hace el post.
// Esto surge de la necesidad puntual de que cuando borro la autenticacion del
// almacenamiento, necesita hacer un post, y lo hace, y guarda todo en el
// almacenamietno pero al ejecutar nuevamente el axiosBase en otra llamada
// esta funcion no se renderiza de nuevo ya que no es un componente

try {
  const authJSON = localStorage.getItem("docu.auth");
  setTimeout(() => console.log("authJSON", authJSON), 3000);

  if (authJSON) {
    const auth = JSON.parse(authJSON);
    console.info("auth.access ", auth.access);
    axiosBase.defaults.headers.common["Authorization"] =
      "Bearer " + auth.access;
  }
} catch (e) {
  console.log("Error en axios base", e);
  if (e === "TypeError: auth is null") {
    console.log("No se encontro el registro de autenticacion");
  }
  // no encontro el archivo en
}
// El siguiente if se agrega, ya que si no esta logueado e intenta asignar el token
// se queda la pantalla en blanco ya que no puede asignarlo

// Ver esto implementacion a futuro 
// axiosBase.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     if (error.response && error.response.status === 401) {
//       // Aquí puedes manejar la lógica de renovación del token o redirección al inicio de sesión.
//       // Por ejemplo, intentar renovar el token utilizando el hook useSelector
//       const auth = useSelector((state) => state.auth); // Asegúrate de ajustar el estado de Redux a tu estructura real

//       if (auth && auth.refreshToken) {
//         // Realizar la lógica para renovar el token aquí
//         // Puedes usar otro axios.post para enviar el refreshToken y obtener un nuevo token de acceso
//         // Luego actualiza el token en axiosBase.defaults.headers.common["Authorization"]
//       } else {
//         // Si no se puede renovar el token, redirige al usuario a la página de inicio de sesión
//         // Puedes utilizar react-router-dom u otra librería de enrutamiento que estés utilizando
//         window.location.href = "/login"; // Ajusta la ruta según tu configuración
//       }
//     }
//     return Promise.reject(error);
//   }
// );





export default axiosBase;
