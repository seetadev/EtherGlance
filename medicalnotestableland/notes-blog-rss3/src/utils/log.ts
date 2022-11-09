import debug from 'debug'
import { getDefaultLogNamespace } from './env'

/**
 * init ns for better debug ex
 */
const ns = getDefaultLogNamespace()
if (typeof window !== 'undefined')
  localStorage.debug = `${ns}:*`

const log = (() => {
  const logger = ((info: string) => {
    const log = debug(`${ns}:default`)
    // eslint-disable-next-line no-console
    console.trace(info)
    return log(info)
  }) as ReturnType< typeof debug > & {
    sub: (subNamespace: string) => ReturnType<typeof debug>
  }

  logger.sub = (subNamespace: string) => {
    return debug(`${ns}:${subNamespace}`)
  }
  return logger
})()

export default log
