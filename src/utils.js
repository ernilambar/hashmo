import * as fs from 'node:fs'

const createFile = (filename, content, cb) => {
  fs.open(filename, 'r', function (err, fd) {
    if (err) {
      fs.writeFile(filename, content, function (err) {
        if (err) {
          if (cb) cb(err)
          else console.error(err)
          return
        }
        if (cb) cb()
      })
      return
    }
    fs.close(fd, (closeErr) => {
      if (cb) cb(closeErr || null)
    })
  })
}

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const updateFile = (filename, content, cb) => {
  fs.writeFile(filename, content, function (err) {
    if (err) {
      if (cb) cb(err)
      else console.error(err)
      return
    }
    if (cb) cb()
  })
}

const getHashString = (isRaw) => {
  if (isRaw) {
    return Date.now().toString()
  }

  return Number(Date.now()).toString(16)
}

function escapePhpString (s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

const getFileContent = (hash, type) => {
  let output = hash

  if (type === 'php') {
    output = `<?php return "${escapePhpString(hash)}";`
  } else if (type === 'json') {
    output = JSON.stringify({ hash })
  }

  return output
}

const handleHashFile = (filePath, content, cb) => {
  const done = (err) => {
    if (cb) cb(err)
  }

  fs.promises.writeFile(filePath, content, { flag: 'wx' })
    .then(() => done())
    .catch((err) => {
      if (err.code === 'EEXIST') {
        return fs.promises.writeFile(filePath, content).then(() => done()).catch(done)
      }
      done(err)
    })
}

export { createFile, createDir, updateFile, getHashString, getFileContent, handleHashFile }
