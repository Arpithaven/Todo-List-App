import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')
const auth0Domain = process.env.AUTH0_DOMAIN // Your Auth0 domain

const jwksUrl = `https://${auth0Domain}/.well-known/jwks.json`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  if (!jwt){
    throw new Error('invalid token')
  }

  try{
    const response = await Axios.get(jwksUrl)
    const keys = response.data.keys
    const signingKey = keys.find(key => key.kid == jwt.header.kid)

    if (!signingKey) {
      throw new Error('jwks endpoint didnt have keys')
    }
    const cert = `-----BEGIN CERTIFICATE-----\n${signingKey.x5c[0]}\n-----END CERTIFICATE-----`

    return jsonwebtoken.verify(token, cert, { algorithms: ['RS256'] })
  } catch (error) {
    logger.error('Token Verification error', error)
    throw error
  }
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
