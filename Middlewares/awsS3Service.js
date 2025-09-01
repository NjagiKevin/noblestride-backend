const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFileToS3 = async (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}-${file.originalname}`,
    Body: fileStream,
  };

  try {
    const data = await s3.upload(uploadParams).promise();
    return data.Location; // Returns the URL of the uploaded file
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};

module.exports = { uploadFileToS3 };