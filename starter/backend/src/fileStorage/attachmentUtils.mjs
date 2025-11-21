import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'

const s3Client = AWSXRay.captureAWSv3Client(new S3Client())

export class AttachmentUtils{
    constructor(
        bucketName = process.env.ATTACHMENT_S3_BUCKET,
        urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    )
    {
        this.bucketName = bucketName
        this.urlExpiration = parseInt(urlExpiration)
    }

    getAttachmentUrl(todoId){
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
    }

    async getUploadUrl(todoId){
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: todoId
        })

        return await getSignedUrl(
            s3Client, 
            command, 
            {
                expiresIn: this.urlExpiration
            }
        )
    }
}