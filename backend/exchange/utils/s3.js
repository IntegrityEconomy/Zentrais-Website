const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

// Build S3 client config
// If AWS_ACCESS_KEY_ID is set (local dev), use explicit credentials
// Otherwise, SDK will use IAM role (AWS ECS/EC2/Lambda)
const s3Config = {
  region: process.env.AWS_REGION || 'us-east-1',
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const s3 = new S3Client(s3Config);
const BUCKET = process.env.AWS_S3_BUCKET || 'zentrais-marketplace-assets';

/**
 * Upload a file to S3
 * @param {Buffer} buffer - File buffer
 * @param {string} key - S3 object key (path)
 * @param {string} contentType - MIME type
 * @returns {Promise<{url: string, key: string}>}
 */
async function uploadToS3(buffer, key, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 604800 }); // 7 days

  return {
    url: presignedUrl,
    key,
  };
}

/**
 * Upload profile avatar
 * @param {Express.Multer.File} file - Multer file object
 * @param {string} userId - User ID
 * @returns {Promise<{url: string, key: string}>}
 */
async function uploadAvatar(file, userId) {
  const ext = file.originalname.split('.').pop() || 'jpg';
  const key = `avatars/${userId}/${crypto.randomUUID()}.${ext}`;
  return uploadToS3(file.buffer, key, file.mimetype);
}

/**
 * Upload listing image
 * @param {Express.Multer.File} file - Multer file object
 * @param {string} userId - User ID
 * @param {string} listingId - Listing ID (optional, use 'new' for new listings)
 * @returns {Promise<{url: string, key: string}>}
 */
async function uploadListingImage(file, userId, listingId = 'new') {
  const ext = file.originalname.split('.').pop() || 'jpg';
  const key = `listings/${userId}/${listingId}/${crypto.randomUUID()}.${ext}`;
  return uploadToS3(file.buffer, key, file.mimetype);
}

/**
 * Get a presigned URL for private objects
 * @param {string} key - S3 object key
 * @param {number} expiresIn - Expiration in seconds (default 1 hour)
 * @returns {Promise<string>}
 */
async function getPresignedUrl(key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn });
}

/**
 * Delete an object from S3
 * @param {string} key - S3 object key
 */
async function deleteFromS3(key) {
  await s3.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }));
}

module.exports = {
  s3,
  uploadToS3,
  uploadAvatar,
  uploadListingImage,
  getPresignedUrl,
  deleteFromS3,
};
