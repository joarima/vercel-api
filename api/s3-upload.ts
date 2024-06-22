import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// cors setting for local development
// see: https://github.com/vercel/vercel/issues/10927
const allowCors = (func) => {
  return (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader(
      'Access-Control-Allow-Origin',
      `${process.env.CORS_ALLOWED_ORIGIN}`
    )
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    )
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return func(req, res)
  }
}

const POST = allowCors(
  async (request: VercelRequest, response: VercelResponse) => {
    const { filename, contentType } = await request.body

    try {
      const client = new S3Client({ region: process.env.AWS_S3_REGION })

      if (!process.env.AWS_S3_BUCKET)
        return response.json({
          error: 'environment variable AWS_S3_BUCKET not found.',
        })

      const { url, fields } = await createPresignedPost(client, {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: 'images/' + filename,
        Conditions: [
          ['content-length-range', 0, 104857600],
          ['starts-with', '$Content-Type', contentType],
        ],
        Fields: {
          acl: 'public-read',
          'Content-Type': contentType,
        },
        Expires: 600, // Seconds before the presigned post expires. 3600 by default.
      })

      return response.json({ url, fields })
    } catch (error) {
      console.log(error)
      return response.json({ error: 'createPresignedPost error.' })
    }
  }
)
export default POST
