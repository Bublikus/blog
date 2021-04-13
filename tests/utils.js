exports.isResponseOK = (res) => {
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('data')
  expect(res.body.data).not.toBeFalsy()
}
