module.exports = obj => Object
  .keys(obj)
  .reduce((acc, key) => obj[key] === undefined ? acc : { ...acc, [key]: obj[key] }, {})
