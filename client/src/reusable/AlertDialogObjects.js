export const alert401 = (response) =>  {
    return {
    title: "Lo sentimos ha ocurrido un error",
    content: (response.status === 401 ? "El usuario o la contraseña son incorrectos":""),
    icon: 'cancel',
    timer:3,
    actionCancelButton: () => {},
    }
  }