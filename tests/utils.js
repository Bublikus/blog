const request = require('supertest')
const app = require('../server')
const { user: userConfig } = require('../src/config')

exports.isResponseOK = (res) => {
  expect(res.statusCode).toEqual(200)
  expect(res.body).toHaveProperty('data')
  expect(res.body.data).not.toBeFalsy()
  expect(res.body.error).toBeFalsy()
}

exports.getTokens = async () => {
  const adminCreds = {
    // id: '1',
    username: 'admin',
    password: 'pass',
  }
  const editorCreds = {
    // id: '2',
    username: 'editor',
    password: 'pass',
  }
  const userCreds = {
    // id: '3',
    username: 'user',
    password: 'pass',
  }

  const [
    admin,
    editor,
    user,
  ] = await Promise.all([
    request(app).post('/api/auth/login').send(adminCreds).then(res => res.body.data),
    request(app).post('/api/auth/login').send(editorCreds).then(res => res.body.data),
    request(app).post('/api/auth/login').send(userCreds).then(res => res.body.data),
  ])

  return {
    admin,
    editor,
    user,
    guest: {
      data: {
        role_id: userConfig.userRoles.guest
      }
    }
  }
}
