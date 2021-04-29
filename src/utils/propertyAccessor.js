function get (object, path) {
  const parts = path.split('.')

  while (parts.length > 0) {
    object = object[parts.shift()]
  }

  return object
}

function set (object, path, value) {
  const parts = path.split('.')

  while (parts.length > 1) {
    object = object[parts.shift()]
  }

  object[parts.shift()] = value
}

module.exports = {
  get,
  set,
}
