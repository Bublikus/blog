module.exports = cb => (req, res, next, ...args) => {
  try {
    return cb(req, res, next, ...args)
  } catch (err) { next(err) }
}
