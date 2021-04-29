function normalize (error) {
  return error.details.map(detail => normalizeDetail(detail))
}

function normalizeDetail (detail) {
  return {
    pointer: detail.path.join('.'),
    detail: detail.message,
  }
}

module.exports = {
  normalize,
}
