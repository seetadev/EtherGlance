import { getIpfsAuthHeaderValue } from '@/utils/env'
import log from '@/utils/log'
import axios from 'axios'

const serviceLog = log.sub('service')

const authorizationValue = getIpfsAuthHeaderValue()
serviceLog(`using ipfs auth key as ${authorizationValue}`)

axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = authorizationValue
    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)
