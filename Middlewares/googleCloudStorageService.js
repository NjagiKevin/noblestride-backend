const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEY_FILE_PATH, // Path to your service account key file
});

const uploadFileToGCS = async (file) => {
  const bucketName = process.env.GCS_BUCKET_NAME;
  const bucket = storage.bucket(bucketName);

  const blobName = `${Date.now()}-${file.originalname}`;
  const blob = bucket.file(blobName);

  const fileStream = fs.createReadStream(file.path);

  try {
    await new Promise((resolve, reject) => {
      fileStream.pipe(blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
        },
      }))
      .on('error', reject)
      .on('finish', resolve);
    });
    return `https://storage.googleapis.com/${bucketName}/${blobName}`;
  } catch (error) {
    console.error("Error uploading to Google Cloud Storage:", error);
    throw error;
  }
};

module.exports = { uploadFileToGCS };