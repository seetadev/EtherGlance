const env = import.meta.env

const NAMESPACE_KEY = 'VITE_LOG_NAMESPACE'
const IPFS_ID = 'VITE_INFURA_IPFS_PROJECT_ID'
const IPFS_SECRET = 'VITE_INFURA_IPFS_PROJECT_SECRET'

export const getDefaultLogNamespace = () => {
  return env[NAMESPACE_KEY] || 'DEBUG'
}

export const getIpfsAuthHeaderValue = () => {
  const id = env[IPFS_ID]
  const secret = env[IPFS_SECRET]
  const authorizationValue = `Basic ${btoa(`${id}:${secret}`)}`
  return authorizationValue
}
