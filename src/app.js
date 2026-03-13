import path from 'node:path'
import { getHashString, getFileContent, createDir, handleHashFile } from './utils.js'

/**
 * Generate a hash file from the current timestamp.
 * @param {Object} flags - Options: type ('plaintext'|'php'), destination (dir), output (filename), raw (boolean).
 * @param {Function} [cb] - Callback (err). When omitted, writes are fire-and-forget: the process may exit before the write completes. For scripts or reliability, pass a callback.
 */
const generateHash = (flags, cb) => {
  const isRaw = !!(flags.raw)

  const { type, destination, output } = flags

  const outputTrimmed = typeof output === 'string' ? output.trim() : ''
  if (!outputTrimmed) {
    const err = new Error('output filename cannot be empty')
    if (cb) return cb(err)
    throw err
  }

  const fullDestination = path.resolve(destination)

  try {
    createDir(fullDestination)
  } catch (e) {
    if (cb) return cb(e)
    throw e
  }

  const filePath = path.join(fullDestination, outputTrimmed)
  const content = getFileContent(getHashString(isRaw), type)

  if (cb) {
    handleHashFile(filePath, content, cb)
  } else {
    handleHashFile(filePath, content)
  }
}

export { generateHash }
