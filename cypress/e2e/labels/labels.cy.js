import {dataResponse} from "./dataResponse";
const response = dataResponse;
describe("Labels page - Caso de Uso imprimir etiquetas", () => {
  const username = "garip.federico@gmail.com";
  const password = "123";
  beforeEach("Logueo", () => {

    // Logueo
    cy.visit("http://localhost:3000/landing");
    cy.get("#username").type("garip.federico@gmail.com");
    cy.get("#password").type("123");
    cy.get(".MuiStack-root > .MuiButtonBase-root").click();
    cy.url().should("include", "http://localhost:3000/home");
    // cy.visit("http://localhost:3000/digitalizacion/etiquetas");
    // });
    // it("Navigation a components verification", () => {
    // Navegacion
    cy.url().should("include", "http://localhost:3000/home");
    cy.get('[data-cy="digitalization"]').should("exist").click();
    cy.get('[data-cy="labels"]').should("exist").click();
    cy.url().should("include", "http://localhost:3000/digitalization/labels");

    //Verificacion de la existencia de componentes
    cy.get('[data-cy="tab-text"]')
      .eq(0)
      .should("have.text", "Crear lote nuevo");
    cy.get('[data-cy="tab-text"]')
      .eq(1)
      .should("have.text", "Reimprimir etiquetas");
    //Verificacion del texto de los componentes
    cy.get("#expedientNumber-label").should(
      "have.text",
      "Numero de expediente"
    );
    cy.get("#quantity-label").should("have.text", "Cantidad");
    cy.get("#expedientNumber").type("12");
    cy.get("#quantity").type("12");
  });

  it("Imprimir etiquetas, curso normal", () => {
    cy.window().then((win) => {
      cy.stub(win.console, "log").as("consoleLog");
    });

    cy.get(".MuiStack-root > .MuiButtonBase-root")
      .should("have.text", "Crear e Imprimir")
      .click();
    // });
    // cy.get("@consoleLog").should("be.calledWith", "Pdf generado correctamente");
    cy.window().then((win) => {
      // Verificar que la referencia a la nueva ventana no sea nula
      expect(win).to.not.be.null;
    });
    cy.url().should("include", "/home");
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "Lote creado exitosamente. Un momento por favor."
    );
  });

  it("Imprimir etiquetas, 404 Recurso no encontrado", () => {
    const apiUrl =
      Cypress.env("API_URL") + "/api/document/create-document-and-labels/";
    cy.log(`La URL de la API es: ${apiUrl}`);
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: apiUrl, // that have a URL that matches '/users/*'
      },
      {
        statusCode: 404, // and force the response to be: []
      }
    ).as("getUsers"); // and assign an alias

    cy.get(".MuiStack-root > .MuiButtonBase-root")
      .should("have.text", "Crear e Imprimir")
      .click();

    cy.get("#alert-dialog-title").should(
      "have.text",
      "Lo sentimos ha ocurrido un error"
    );

    cy.get(".MuiDialogContent-root > .MuiStack-root > :nth-child(1)").should(
      "have.text",
      "Recurso no encontrado "
    );
  });
  it("Imprimir etiquetas, 403 No tiene permisos o no está autenticado", () => {
    const apiUrl =
      Cypress.env("API_URL") + "/api/document/create-document-and-labels/";
    cy.log(`La URL de la API es: ${apiUrl}`);
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: apiUrl, // that have a URL that matches '/users/*'
      },
      {
        statusCode: 403, // and force the response to be: []
      }
    ).as("getUsers"); // and assign an alias

    cy.get(".MuiStack-root > .MuiButtonBase-root")
      .should("have.text", "Crear e Imprimir")
      .click();
    cy.get("#alert-dialog-title").should(
      "have.text",
      "Lo sentimos ha ocurrido un error"
    );
    cy.get(".MuiDialogContent-root > .MuiStack-root > :nth-child(1)").should(
      "have.text",
      "No tiene permisos o no está autenticado - Inicie nuevamente la sesión "
    );
  });
  it("Imprimir etiquetas, 401 No autorizado", () => {
    const apiUrl =
      Cypress.env("API_URL") + "/api/document/create-document-and-labels/";
    cy.log(`La URL de la API es: ${apiUrl}`);
    cy.intercept(
      {
        method: "POST", // Route all GET requests
        url: apiUrl, // that have a URL that matches '/users/*'
      },
      {
        statusCode: 401, // and force the response to be: []
      }
    ).as("getUsers"); // and assign an alias

    cy.get(".MuiStack-root > .MuiButtonBase-root")
      .should("have.text", "Crear e Imprimir")
      .click();
    cy.get("#alert-dialog-title").should(
      "have.text",
      "Lo sentimos ha ocurrido un error"
    );
    cy.get(".MuiDialogContent-root > .MuiStack-root > :nth-child(1)").should(
      "have.text",
      "No autorizado "
    );
  });
});
