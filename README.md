DOCUMENT_MANAGER
======

Backend API



### Requerimientos ###

* docker
* docker-compose
* python 3.11.X
* git
* virtualenv
* pycharm | vscode


### Ejecutar Backend API (entorno completo) ###

con docker-compose se puede tener un entorno muy similiar al de producción de manera sencilla

* clonar proyecto con alguno de los siguientes comandos
   ``` bash
      # Clonar con SSH
      git clone git@github.com:the-julianson/<NAME_OF_PROJECT>.git

      # Clonar con HTTPS
      git clone https://<TU_USUARIO_DE_BITBUCKET>@github.com:the-julianson/<NAME_OF_PROJECT>.git
   ```

* instalar pre-commit


   ``` bash
      # Copiar el config file e instalarlo
      cp .pre-commit-config.template.yaml .pre-commit-config.yaml && pre-commit install

   ```
