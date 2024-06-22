import type { VercelRequest, VercelResponse } from '@vercel/node'
// cors setting for local development
// see: https://github.com/vercel/vercel/issues/10927
// const allowCors = (func) => {
//   return (req, res) => {
//     console.log(req.headers.origin)
//     res.setHeader('Access-Control-Allow-Credentials', true)
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader(
//       'Access-Control-Allow-Methods',
//       'GET,OPTIONS,PATCH,DELETE,POST,PUT'
//     )
//     res.setHeader(
//       'Access-Control-Allow-Headers',
//       'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//     )
//     if (req.method === 'OPTIONS') {
//       res.status(200).end()
//       return
//     }
//     return func(req, res)
//   }
// }

// const handler = allowCors((req, res) => {
//   const { name = 'World' } = req.query
//   return res.json({
//     message: `Hello ${name}!`,
//   })
// })

const handler = (req: VercelRequest, res: VercelResponse) => {
  const { name = 'World' } = req.query
  return res.json({
    message: `Hello ${name}!`,
  })
}
export default handler
