export function isTokenExpired(exp) {
  console.log("exp ",exp )
    
    if (exp) {
      const expirationTimestamp = exp * 1000; // Convertir la fecha de expiración a milisegundos
    // const expirationTimestamp = 169169305; // una fecha vieja para testear el validator
    const currentTimestamp = Date.now(); // Obtener la marca de tiempo actual en milisegundos
    
      return currentTimestamp > expirationTimestamp;
    }
    
    return true; // Si no hay una marca de tiempo de expiración, consideramos el token como vencido
  }