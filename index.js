const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const { TableClient } = require('@azure/data-tables');
const path = require('path');
const fs = require('fs');

// Configuração do Azure Blob Storage usando URL SAS
const blobServiceClient = new BlobServiceClient('https://stocn2a01.blob.core.windows.net/?sv=2022-11-02&ss=bt&srt=sco&sp=rwdlacuiytfx&se=2024-09-17T07:36:42Z&st=2024-09-09T23:36:42Z&spr=https&sig=h%2FSvBz5ahgaV3PG%2FridRhR0S7hwQwPET8RiTJXWJAgQ%3D');
const containerClient = blobServiceClient.getContainerClient('photos');

// Configuração do Azure Table Storage usando URL SAS
const tableClient = new TableClient(
  'https://stocn2a01.table.core.windows.net/PhotoMetadata?sv=2022-11-02&ss=bt&srt=sco&sp=rwdlacuiytfx&se=2024-09-17T07:36:42Z&st=2024-09-09T23:36:42Z&spr=https&sig=h%2FSvBz5ahgaV3PG%2FridRhR0S7hwQwPET8RiTJXWJAgQ%3D',
  'PhotoMetadata'
);

const app = express();
const port = 3000;

// Configuração do multer para uploads de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware para criar diretório uploads se não existir
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Rota para upload de fotos
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const blobName = req.file.filename;
    const stream = fs.createReadStream(req.file.path);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.uploadStream(stream);
    
    const metadata = {
      user: req.body.user,
      uploadDate: new Date().toISOString(),
      album: req.body.album || '',
    };
    
    await tableClient.createEntity({
      partitionKey: req.body.album || 'default',
      rowKey: blobName,
      ...metadata
    });

    fs.unlinkSync(req.file.path); // Remove o arquivo local após o upload
    res.status(200).send('Foto enviada e metadados armazenados.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao enviar foto.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
