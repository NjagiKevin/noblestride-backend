const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'documents';

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

const uploadFileToAzureBlob = async (file) => {
  const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
  await containerClient.createIfNotExists();

  const blobName = `${Date.now()}-${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const fileStream = fs.createReadStream(file.path);

  try {
    await blockBlobClient.uploadStream(fileStream, file.size);
    return blockBlobClient.url;
  } catch (error) {
    console.error("Error uploading to Azure Blob:", error);
    throw error;
  }
};

module.exports = { uploadFileToAzureBlob };