const request = require('supertest')
const app = require('../../server')
const { isResponseOK, getTokens } = require('../utils')
const { usersMock } = require('../mocks')

const BASE_PATH = '/api/users'

let users = {}

beforeAll(async () => {
  users = await getTokens()
})

describe('Users route', () => {

  describe('Guest', () => {
    it('Can\'t get all users', async () => {
      await request(app).get(BASE_PATH).expect(403)
    })

    it('Can get a user with role="user"', async () => {
      const res = await request(app).get(`${BASE_PATH}/3`)
      isResponseOK(res)
      expect(res.body.data).toStrictEqual(users.user.data)
    })

    it('Can\'t update a user with role="user"', async () => {
      await request(app).put(`${BASE_PATH}/3`).send({ username: users.user.data.username }).expect(403)
    })

    it('Can\'t delete a user with role="user"', async () => {
      await request(app).delete(`${BASE_PATH}/3`).expect(403)
    })

    it('Can get self', async () => {
      const res = await request(app).get(`${BASE_PATH}/me`)
      isResponseOK(res)
      expect(res.body.data).toStrictEqual(users.guest.data)
    })
  })

  describe('User', () => {
    it('Can\'t get all users', async () => {
      await request(app).get(BASE_PATH).set('Authorization', users.user.token).expect(403)
    })

    it('Can get a user with role="editor"', async () => {
      const res = await request(app).get(`${BASE_PATH}/2`).set('Authorization', users.user.token)
      isResponseOK(res)
      expect(res.body.data).toStrictEqual(users.editor.data)
    })

    it('Can\'t update a user with role="editor"', async () => {
      await request(app)
        .put(`${BASE_PATH}/2`)
        .set('Authorization', users.user.token)
        .send({ username: users.editor.data.username })
        .expect(403)
    })

    it('Can\'t delete a user with role="editor"', async () => {
      await request(app).delete(`${BASE_PATH}/2`).set('Authorization', users.user.token).expect(403)
    })

    it('Can get self', async () => {
      const res = await request(app).get(`${BASE_PATH}/me`).set('Authorization', users.user.token)
      isResponseOK(res)
      expect(res.body.data).toStrictEqual(users.user.data)
    })

    it('Can update self', async () => {
      const updatedUser = await request(app)
        .put(`${BASE_PATH}/3`)
        .set('Authorization', users.user.token)
        .send({ username: users.user.data.username + '_updated' })
      isResponseOK(updatedUser)
      expect(updatedUser.body.data.username).toEqual(users.user.data.username + '_updated')

      const revertedUser = await request(app)
        .put(`${BASE_PATH}/3`)
        .set('Authorization', users.user.token)
        .send({ username: users.user.data.username })
      isResponseOK(revertedUser)
      expect(revertedUser.body.data.username).toEqual(users.user.data.username)
    })

    it('Cen delete self', async () => {
      await request(app).delete(`${BASE_PATH}/3`).set('Authorization', users.user.token).expect(200)
      const nowGuest = await request(app).get(`${BASE_PATH}/me`).set('Authorization', users.user.token)
      isResponseOK(nowGuest)
      expect(nowGuest.body.data).toStrictEqual(users.guest.data)
    })
  })

  describe('Editor', () => {
    it('Can\'t get all users', async () => {
      await request(app).get(BASE_PATH).set('Authorization', users.editor.token).expect(403)
    })

    it('Can get a user with role="admin"', async () => {
      const res = await request(app).get(`${BASE_PATH}/1`).set('Authorization', users.editor.token)
      isResponseOK(res)
      expect(res.body.data).toStrictEqual(users.admin.data)
    })

    it('Can\'t update a user with role="admin"', async () => {
      await request(app)
        .put(`${BASE_PATH}/1`)
        .set('Authorization', users.editor.token)
        .send({ username: users.admin.data.username })
        .expect(403)
    })

    it('Can\'t delete a user with role="admin"', async () => {
      await request(app).delete(`${BASE_PATH}/1`).set('Authorization', users.editor.token).expect(403)
    })

    it('Can get self', async () => {
      const res = await request(app).get(`${BASE_PATH}/me`).set('Authorization', users.editor.token)
      isResponseOK(res)
      expect(res.body.data).toStrictEqual(users.editor.data)
    })

    it('Can update self', async () => {
      const updatedUser = await request(app)
        .put(`${BASE_PATH}/2`)
        .set('Authorization', users.editor.token)
        .send({ username: users.editor.data.username + '_updated' })
      isResponseOK(updatedUser)
      expect(updatedUser.body.data.username).toEqual(users.editor.data.username + '_updated')

      const revertedUser = await request(app)
        .put(`${BASE_PATH}/2`)
        .set('Authorization', users.editor.token)
        .send({ username: users.editor.data.username })
      isResponseOK(revertedUser)
      expect(revertedUser.body.data.username).toEqual(users.editor.data.username)
    })

    // Left it for testing admin
    // it('Can delete self', async () => {
    //   await request(app).delete(`${BASE_PATH}/2`).set('Authorization', users.editor.token).expect(200)
    //   const nowGuest = await request(app).get(`${BASE_PATH}/me`).set('Authorization', users.editor.token)
    //   isResponseOK(nowGuest)
    //   expect(nowGuest.body.data).toStrictEqual(users.guest.data)
    // })
  })

  describe('Admin', () => {
    it('Can get all users', async () => {
      const res = await request(app).get(BASE_PATH).set('Authorization', users.admin.token)
      isResponseOK(res)
      res.body.data.slice(0, 10).forEach(userRes => {
        Object.keys(usersMock.user).forEach(k => expect(userRes).toHaveProperty(k))
        expect(userRes).not.toHaveProperty('hash')
        expect(userRes).not.toHaveProperty('salt')
        expect(userRes).not.toHaveProperty('token')
        expect(userRes).not.toHaveProperty('password')
      })
    })

    it('Can get a user with role="editor"', async () => {
      const res = await request(app).get(`${BASE_PATH}/2`).set('Authorization', users.admin.token)
      isResponseOK(res)
      expect(res.body.data).toStrictEqual(users.editor.data)
    })

    it('Can update a user with role="editor"', async () => {
      const updatedUser = await request(app)
        .put(`${BASE_PATH}/2`)
        .set('Authorization', users.admin.token)
        .send({ username: users.editor.data.username + '_updated' })
      isResponseOK(updatedUser)
      expect(updatedUser.body.data.username).toEqual(users.editor.data.username + '_updated')

      const revertedUser = await request(app)
        .put(`${BASE_PATH}/2`)
        .set('Authorization', users.admin.token)
        .send({ username: users.editor.data.username })
      isResponseOK(revertedUser)
      expect(revertedUser.body.data.username).toEqual(users.editor.data.username)
    })

    it('Can delete a user with role="editor"', async () => {
      await request(app).delete(`${BASE_PATH}/2`).set('Authorization', users.admin.token).expect(200)
      const resEditor = await request(app).get(`${BASE_PATH}/2`).set('Authorization', users.admin.token)
      expect(resEditor.status).toEqual(404)
      expect(resEditor.body.data).toBeFalsy()
    })

    it('Can get self', async () => {
      const res = await request(app).get(`${BASE_PATH}/me`).set('Authorization', users.admin.token)
      isResponseOK(res)
      expect(res.body.data).toStrictEqual(users.admin.data)
    })

    it('Can update self', async () => {
      const updatedUser = await request(app)
        .put(`${BASE_PATH}/1`)
        .set('Authorization', users.admin.token)
        .send({ username: users.admin.data.username + '_updated' })
      isResponseOK(updatedUser)
      expect(updatedUser.body.data.username).toEqual(users.admin.data.username + '_updated')

      const revertedUser = await request(app)
        .put(`${BASE_PATH}/1`)
        .set('Authorization', users.admin.token)
        .send({ username: users.admin.data.username })
      isResponseOK(revertedUser)
      expect(revertedUser.body.data.username).toEqual(users.admin.data.username)
    })

    it('Can delete self', async () => {
      await request(app).delete(`${BASE_PATH}/1`).set('Authorization', users.admin.token).expect(200)
      const resAdmin = await request(app).get(`${BASE_PATH}/1`).set('Authorization', users.admin.token)
      expect(resAdmin.status).toEqual(404)
      expect(resAdmin.body.data).toBeFalsy()
    })
  })

})
