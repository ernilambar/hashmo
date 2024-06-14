import path from 'path'
import { getHashString, getFileContent, createDir, handleHashFile } from './utils.js'

const generateHash = (flags) => {
  const isRaw = !!(flags.raw)

  const { type, destination, output } = flags

  const fullDestination = path.resolve(destination)

  createDir(fullDestination)

  handleHashFile(path.join(fullDestination, output), getFileContent(getHashString(isRaw), type))
}

export { generateHash }
