const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'documents';

let blobServiceClient;
let isAzureBlobServiceReady = false;

try {
    if(!AZURE_STORAGE_CONNECTION_STRING) {
        throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set.");
    }
    blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    isAzureBlobServiceReady = true;
} catch (e) {
    console.error("Failed to initialize Azure Blob Service. Please check your AZURE_STORAGE_CONNECTION_STRING environment variable.", e.message);
}

const uploadFileToAzureBlob = async (file) => {
  if (!isAzureBlobServiceReady) {
    throw new Error("Azure Blob Service is not available due to configuration errors.");
  }
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
