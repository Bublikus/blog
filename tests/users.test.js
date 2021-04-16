const request = require('supertest')
const app = require('../server')
const { isResponseOK, getTokens } = require('./utils')

let users = {}

beforeAll(async () => {
  users = await getTokens()
})

describe('Users route', () => {

  // Guest

  it('Guest: Get all users', async () => {
    await request(app).get('/api/users').expect(403)
  })

  it('Guest: Get role="user" user', async () => {
    const res = await request(app).get('/api/users/3')
    isResponseOK(res)
    expect(res.body.data).toStrictEqual(users.user.data)
  })

  it('Guest: Update role="user" user', async () => {
    await request(app).put('/api/users/3').send({ username: users.user.data.username }).expect(403)
  })

  it('Guest: Delete role="user" user', async () => {
    await request(app).delete('/api/users/3').expect(403)
  })

  it('Guest: Get self', async () => {
    const res = await request(app).get('/api/users/me')
    isResponseOK(res)
    expect(res.body.data).toStrictEqual(users.guest.data)
  })

  // User

  it('User: Get all users', async () => {
    await request(app).get('/api/users').set('Authorization', users.user.token).expect(403)
  })

  it('User: Get role="editor" user', async () => {
    const res = await request(app).get('/api/users/2').set('Authorization', users.user.token)
    isResponseOK(res)
    expect(res.body.data).toStrictEqual(users.editor.data)
  })

  it('User: Update role="editor" user', async () => {
    await request(app)
      .put('/api/users/2')
      .set('Authorization', users.user.token)
      .send({ username: users.editor.data.username })
      .expect(403)
  })

  it('User: Delete role="editor" user', async () => {
    await request(app).delete('/api/users/2').set('Authorization', users.user.token).expect(403)
  })

  it('User: Get self', async () => {
    const res = await request(app).get('/api/users/me').set('Authorization', users.user.token)
    isResponseOK(res)
    expect(res.body.data).toStrictEqual(users.user.data)
  })

  it('User: Update self', async () => {
    const updatedUser = await request(app)
      .put('/api/users/3')
      .set('Authorization', users.user.token)
      .send({ username: users.user.data.username + '_updated' })
    isResponseOK(updatedUser)
    expect(updatedUser.body.data.username).toEqual(users.user.data.username + '_updated')

    const revertedUser = await request(app)
      .put('/api/users/3')
      .set('Authorization', users.user.token)
      .send({ username: users.user.data.username })
    isResponseOK(revertedUser)
    expect(revertedUser.body.data.username).toEqual(users.user.data.username)
  })

  it('User: Delete self', async () => {
    await request(app).delete('/api/users/3').set('Authorization', users.user.token).expect(200)
    const nowGuest = await request(app).get('/api/users/me').set('Authorization', users.user.token)
    isResponseOK(nowGuest)
    expect(nowGuest.body.data).toStrictEqual(users.guest.data)
  })

  // Editor

  it('Editor: Get all users', async () => {
    await request(app).get('/api/users').set('Authorization', users.editor.token).expect(403)
  })

  it('Editor: Get "admin" user', async () => {
    const res = await request(app).get('/api/users/1').set('Authorization', users.editor.token)
    isResponseOK(res)
    expect(res.body.data).toStrictEqual(users.admin.data)
  })

  it('Editor: Update "admin" user', async () => {
    await request(app)
      .put('/api/users/1')
      .set('Authorization', users.editor.token)
      .send({ username: users.admin.data.username })
      .expect(403)
  })

  it('Editor: Delete role="admin" user', async () => {
    await request(app).delete('/api/users/1').set('Authorization', users.editor.token).expect(403)
  })

  it('Editor: Get self', async () => {
    const res = await request(app).get('/api/users/me').set('Authorization', users.editor.token)
    isResponseOK(res)
    expect(res.body.data).toStrictEqual(users.editor.data)
  })

  it('Editor: Update self', async () => {
    const updatedUser = await request(app)
      .put('/api/users/2')
      .set('Authorization', users.editor.token)
      .send({ username: users.editor.data.username + '_updated' })
    isResponseOK(updatedUser)
    expect(updatedUser.body.data.username).toEqual(users.editor.data.username + '_updated')

    const revertedUser = await request(app)
      .put('/api/users/2')
      .set('Authorization', users.editor.token)
      .send({ username: users.editor.data.username })
    isResponseOK(revertedUser)
    expect(revertedUser.body.data.username).toEqual(users.editor.data.username)
  })

  // Left it for testing admin
  // it('Editor: Delete self', async () => {
  //   await request(app).delete('/api/users/2').set('Authorization', users.editor.token).expect(200)
  //   const nowGuest = await request(app).get('/api/users/me').set('Authorization', users.editor.token)
  //   isResponseOK(nowGuest)
  //   expect(nowGuest.body.data).toStrictEqual(users.guest.data)
  // })

  // Admin

  it('Admin: Get all users', async () => {
    const res = await request(app).get('/api/users').set('Authorization', users.admin.token)
    isResponseOK(res)
    res.body.data.slice(0, 10).forEach(userRes => {
      [
        'id',
        'username',
        'role_id',
        'avatar_id',
        'created_at',
        'updated_at',
      ].forEach(k => {
        expect(userRes).toHaveProperty(k)
        expect(userRes).not.toHaveProperty('hash')
        expect(userRes).not.toHaveProperty('salt')
        expect(userRes).not.toHaveProperty('token')
        expect(userRes).not.toHaveProperty('password')
      })
    })
  })

  it('Admin: Get "editor" user', async () => {
    const res = await request(app).get('/api/users/2').set('Authorization', users.admin.token)
    isResponseOK(res)
    expect(res.body.data).toStrictEqual(users.editor.data)
  })

  it('Admin: Update "editor" user', async () => {
    const updatedUser = await request(app)
      .put('/api/users/2')
      .set('Authorization', users.admin.token)
      .send({ username: users.editor.data.username + '_updated' })
    isResponseOK(updatedUser)
    expect(updatedUser.body.data.username).toEqual(users.editor.data.username + '_updated')

    const revertedUser = await request(app)
      .put('/api/users/2')
      .set('Authorization', users.admin.token)
      .send({ username: users.editor.data.username })
    isResponseOK(revertedUser)
    expect(revertedUser.body.data.username).toEqual(users.editor.data.username)
  })

  it('Admin: Delete role="editor" user', async () => {
    await request(app).delete('/api/users/2').set('Authorization', users.admin.token).expect(200)
    const resEditor = await request(app).get('/api/users/2').set('Authorization', users.admin.token)
    expect(resEditor.status).toEqual(404)
    expect(resEditor.body.data).toBeFalsy()
  })

  it('Admin: Get self', async () => {
    const res = await request(app).get('/api/users/me').set('Authorization', users.admin.token)
    isResponseOK(res)
    expect(res.body.data).toStrictEqual(users.admin.data)
  })

  it('Admin: Update self', async () => {
    const updatedUser = await request(app)
      .put('/api/users/1')
      .set('Authorization', users.admin.token)
      .send({ username: users.admin.data.username + '_updated' })
    isResponseOK(updatedUser)
    expect(updatedUser.body.data.username).toEqual(users.admin.data.username + '_updated')

    const revertedUser = await request(app)
      .put('/api/users/1')
      .set('Authorization', users.admin.token)
      .send({ username: users.admin.data.username })
    isResponseOK(revertedUser)
    expect(revertedUser.body.data.username).toEqual(users.admin.data.username)
  })

  it('Admin: Delete self', async () => {
    await request(app).delete('/api/users/1').set('Authorization', users.admin.token).expect(200)
    const resAdmin = await request(app).get('/api/users/1').set('Authorization', users.admin.token)
    expect(resAdmin.status).toEqual(404)
    expect(resAdmin.body.data).toBeFalsy()
  })

})
