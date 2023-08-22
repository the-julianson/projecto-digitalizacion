describe("Login/ Landing page - Component verification and Login successful and failed", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/landing");
  });

  it("Displays two tabs items by default one with the text ingreso and the other registro", () => {
    cy.get('[data-cy="simple-tab"]').should("have.length", 2);
    cy.get('[data-cy="tab-text"]').eq(0).should("have.text", "Iniciar sesión");
    cy.get('[data-cy="tab-text"]').eq(1).should("have.text", "Registro");
  });

  it("Display inputs and buttons with text", () => {
    cy.get("#username-label").should("have.text", "Nombre de usuario");
    cy.get("#password-label").should("have.text", "Contraseña");
    cy.get(".MuiStack-root > .MuiButtonBase-root").should(
      "have.text",
      "Ingresar"
    );
    cy.get('.MuiButton-text').should('have.text', 'No tenes usuario aun?')
  });
  
  it("Login succesfull and redirect to home page", () => {
    cy.get("#username").type("garip.federico@gmail.com");
    cy.get("#password").type("123");
    cy.get(".MuiStack-root > .MuiButtonBase-root").click();
    cy.url().should('include', "http://localhost:3000/home")
  });
  it("Login failed and a dialog message will be showed and closed", () => {
    cy.get("#username").type("garip.federico@gmail.com");
    cy.get("#password").type("12345");
    cy.get(".MuiStack-root > .MuiButtonBase-root").click();
    cy.get('.MuiDialog-container > .MuiPaper-root').should('be.visible')
    cy.get('#alert-dialog-title').should('have.text', 'Lo sentimos ha ocurrido un error')
    // cy.get('#alert-dialog-description')
    cy.get('.MuiDialogContent-root > .MuiStack-root > :nth-child(1)').should('have.text', 'El usuario o la contraseña son incorrectos ')
    cy.get('.MuiDialog-container').click(100,100) 
    cy.get('#alert-dialog-description').should('not.be.visible')
  });

});
