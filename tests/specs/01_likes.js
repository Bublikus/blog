const request = require('supertest')
const app = require('../../server')
const { isResponseOK, getTokens } = require('../utils')
const { likesMock } = require('../mocks')

const BASE_PATH = '/api/likes'

let users = {}

beforeAll(async () => {
  users = await getTokens()
})

describe('Likes route', () => {

  describe('Guest', () => {
    it('Can\'t create own like', async () => {
      await request(app).post(BASE_PATH).send({
        comment_id: likesMock.like.comment_id,
      }).expect(403)
    })

    it('Can\'t delete own like', async () => {
      await request(app).delete(BASE_PATH)
        .query({ comment_id: 2 })
        .expect(400)
    })

    it('Can\'t delete others like', async () => {
      await request(app).delete(BASE_PATH)
        .query({ comment_id: 1 })
        .expect(400)
    })
  })

  describe('User', () => {
    it('Can create own like', async () => {
      const res = await request(app).post(BASE_PATH)
        .set('Authorization', users.user.token)
        .send({
          comment_id: likesMock.like.comment_id,
        })
      isResponseOK(res)
      Object.keys(likesMock.like).forEach(k => expect(res.body.data).toHaveProperty(k))
    })

    it('Can delete own like', async () => {
      await request(app).delete(BASE_PATH)
        .query({ comment_id: 3 })
        .set('Authorization', users.user.token)
        .expect(200)
    })

    it('Can\'t delete others like', async () => {
      await request(app).delete(BASE_PATH)
        .query({ comment_id: 1 })
        .set('Authorization', users.user.token)
        .expect(404)
    })
  })

  describe('Editor', () => {
    it('Can create own like', async () => {
      const res = await request(app).post(BASE_PATH)
        .set('Authorization', users.editor.token)
        .send({
          post_id: likesMock.like.post_id,
        })
      isResponseOK(res)
      Object.keys(likesMock.like).forEach(k => expect(res.body.data).toHaveProperty(k))
    })

    it('Can delete own like', async () => {
      await request(app).delete(BASE_PATH)
        .query({ comment_id: 2 })
        .set('Authorization', users.editor.token)
        .expect(200)
    })

    it('Can\'t delete others like', async () => {
      await request(app).delete(BASE_PATH)
        .query({ comment_id: 1 })
        .set('Authorization', users.editor.token)
        .expect(404)
    })
  })

  describe('Admin', () => {
    it('Can create own like', async () => {
      const res = await request(app).post(BASE_PATH)
        .set('Authorization', users.admin.token)
        .send({
          comment_id: likesMock.like.comment_id,
        })
      isResponseOK(res)
      Object.keys(likesMock.like).forEach(k => expect(res.body.data).toHaveProperty(k))
    })

    it('Can delete own like', async () => {
      await request(app).delete(BASE_PATH)
        .query({ comment_id: 1 })
        .set('Authorization', users.admin.token)
        .expect(200)
    })

    it('Can\'t delete others like', async () => {
      await request(app).delete(BASE_PATH)
        .query({ comment_id: 3 })
        .set('Authorization', users.admin.token)
        .expect(404)
    })
  })

})
