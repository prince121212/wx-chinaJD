import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.STORAGE_REGION || 'auto',
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY!,
    secretAccessKey: process.env.STORAGE_SECRET_KEY!,
  },
})

export async function uploadFile(
  file: Buffer, 
  fileName: string, 
  contentType: string = 'image/jpeg'
): Promise<string> {
  const key = `uploads/${Date.now()}-${fileName}`
  
  const command = new PutObjectCommand({
    Bucket: process.env.STORAGE_BUCKET!,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await s3Client.send(command)
  
  return `${process.env.STORAGE_PUBLIC_URL}/${key}`
}

export async function deleteFile(url: string): Promise<void> {
  const key = url.replace(`${process.env.STORAGE_PUBLIC_URL}/`, '')
  
  const command = new DeleteObjectCommand({
    Bucket: process.env.STORAGE_BUCKET!,
    Key: key,
  })

  await s3Client.send(command)
}