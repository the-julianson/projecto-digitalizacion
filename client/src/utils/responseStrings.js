export const responseStrings = (status) => {
  return status === 403
    ? "No tiene permisos o no está autenticado - Inicie nuevamente la sesión"
    : status === 401
    ? "No autorizado"
    : status === 404
    ? "Recurso no encontrado"
    : status === 500
    ? "Error en el servidor"
    : "Estado de respuesta no reconocido";
};

export const sessionExpiredString = "La sesion ha expirado, redireccionando a login en "

export const weSorryMessage = "Lo sentimos ha ocurrido un error";
