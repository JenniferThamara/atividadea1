# WEB Fotos

## Descrição

A aplicação WEB Fotos foi desenvolvida para o armazenamento de fotos em alta resolução utilizando Node.js. Ela oferece ferramentas para a utilização de metadados, como data de inserção, localização e tags, para uma melhor organização e busca das fotos armazenadas. 

## Funcionalidades

- **Armazenamento de Fotos em Alta Resolução:** Utilizando o serviço de Blob Storage para guardar grandes quantidades de dados não estruturados, como fotos e vídeos.
- **Meta Dados:** Cada foto armazenada possui metadados associados, como data de inserção, localização e tags, facilitando a organização e busca.
- **Table Storage:** Utilizado para armazenar informações estruturais sobre as fotos, como o usuário que fez o upload, a data de criação da imagem e o álbum ao qual a foto pertence. Essa função permite o armazenamento de grandes volumes de dados estruturais e não relacionais na nuvem.

## Tecnologias Utilizadas

- **Node.js:** Plataforma utilizada para desenvolver a aplicação backend.
- **Azure Blob Storage:** Serviço de armazenamento de objetos para dados não estruturados, permitindo o armazenamento de grandes quantidades de fotos em alta resolução.
- **Azure Table Storage:** Serviço de armazenamento de tabelas para dados estruturados, utilizado para armazenar informações sobre os uploads de fotos.
- **Sequelize:** ORM para interagir com o banco de dados.
- **JWT (JSON Web Token):** Para autenticação e autorização de usuários.
- **Multer:** Middleware para upload de arquivos.
- **Jest e Supertest:** Ferramentas utilizadas para testes automatizados.

## Configuração

Para gerenciar de forma direta e fácil as chaves ou endPoints, a aplicação utiliza constantes que centralizam essas configurações. Dessa forma, não é necessário percorrer todas as pastas da aplicação para fazer modificações ou atualizações.

## Como Executar

1. Clone este repositório:

   ```bash
   git clone https://github.com/JenniferThamara/atividadea1.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd WEBFotos
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente necessárias:

   - Crie um arquivo `.env` na raiz do projeto.
   - Adicione as chaves e endPoints necessários no arquivo `.env`.

5. Inicie a aplicação:

   ```bash
   npm start
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

