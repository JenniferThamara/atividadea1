const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const { TableClient } = require('@azure/data-tables');
const path = require('path');
const { blobConnectionStringConst, tableSasUrlConst } = require('./constantes/constantes');
const app = express();
const port = 3000;

// Configurações do Azure
const blobConnectionString = {blobConnectionStringConst};
const tableSasUrl = {tableSasUrlConst};
const containerName = 'grupo01'; // Nome do container no Blob Storage
const tableName = 'tb01'; // Nome da tabela existente no Table Storage

// Inicializa o cliente do Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(blobConnectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Middleware para servir arquivos estáticos da raiz do projeto
app.use(express.static(path.join(__dirname)));

// Middleware para o upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rota para upload de fotos
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo enviado.');
    }

    const blobName = `${Date.now()}_${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload da foto para o Blob Storage
    await blockBlobClient.upload(req.file.buffer, req.file.size);

    // Adiciona metadados no Table Storage
    const tableClient = new TableClient(tableSasUrl, tableName);
    const entity = {
      partitionKey: 'photos',
      rowKey: blobName,
      photoName: req.body.photoName || 'sem_nome',
      uploadDate: new Date().toISOString()
    };
    await tableClient.createEntity(entity);

    res.status(200).send('Foto enviada e metadados salvos com sucesso.');
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error.message || error);
    res.status(500).send(`Erro ao fazer upload da foto: ${error.message || error}`);
  }
});

// Rota para listar fotos
app.get('/photos', async (req, res) => {
  try {
    const tableClient = new TableClient(tableSasUrl, tableName);
    const entities = [];
    for await (const entity of tableClient.listEntities()) {
      entities.push(entity);
    }
    res.json(entities);
  } catch (error) {
    console.error('Erro ao listar fotos:', error.message || error);
    res.status(500).send(`Erro ao listar fotos: ${error.message || error}`);
  }
});

// Rota para criar uma nova tabela (se necessário)
app.post('/create-table/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;

    // Cria um cliente para o serviço de tabela
    const tableServiceClient = TableClient.fromConnectionString(blobConnectionString);

    // Cria a tabela
    await tableServiceClient.createTable(tableName);

    res.status(200).send(`Tabela ${tableName} criada com sucesso.`);
  } catch (error) {
    console.error('Erro ao criar a tabela:', error.message || error);
    res.status(500).send(`Erro ao criar a tabela: ${error.message || error}`);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
