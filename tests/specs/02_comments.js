const request = require('supertest')
const app = require('../../server')
const { isResponseOK, getTokens } = require('../utils')
const { commentsMock } = require('../mocks')

const BASE_PATH = '/api/comments'

let users = {}

beforeAll(async () => {
  users = await getTokens()
})

describe('Comments route', () => {

  describe('Guest', () => {
    it('Can get comments with post_id', async () => {
      const res = await request(app).get(BASE_PATH).query({
        post_id: commentsMock.comment.post_id,
      })
      isResponseOK(res)
      res.body.data.forEach(comment => {
        Object.keys(commentsMock.comment).forEach(k => expect(comment).toHaveProperty(k))
      })
    })

    it('Can\'t get comments without post_id', async () => {
      await request(app).get(BASE_PATH).expect(400)
    })

    it('Can\'t create a comment', async () => {
      await request(app).post(BASE_PATH).send({
        comment: commentsMock.comment.comment,
        post_id: commentsMock.comment.post_id,
      }).expect(403)
    })

    it('Can\'t update any comment', async () => {
      await request(app).put(`${BASE_PATH}/1`).send({ comment: commentsMock.comment.comment }).expect(403)
    })

    it('Can\'t delete any comment', async () => {
      await request(app).delete(`${BASE_PATH}/1`).expect(403)
    })
  })

  describe('User', () => {
    it('Can get comments with post_id', async () => {
      const res = await request(app).get(BASE_PATH).set('Authorization', users.user.token).query({
        post_id: commentsMock.comment.post_id,
      })
      isResponseOK(res)
      res.body.data.forEach(comment => {
        Object.keys(commentsMock.comment).forEach(k => expect(comment).toHaveProperty(k))
      })
    })

    it('Can\'t get comments without post_id', async () => {
      await request(app).get(BASE_PATH).set('Authorization', users.user.token).expect(400)
    })

    it('Can create own comment', async () => {
      const res = await request(app).post(BASE_PATH).set('Authorization', users.user.token).send({
        comment: commentsMock.comment.comment,
        post_id: commentsMock.comment.post_id,
      })
      isResponseOK(res)
      Object.keys(commentsMock.comment).forEach(k => expect(res.body.data).toHaveProperty(k))
    })

    it('Can\'t update own comment', async () => {
      await request(app).put(`${BASE_PATH}/4`)
        .set('Authorization', users.user.token)
        .send({ comment: commentsMock.comment.comment })
        .expect(403)
    })

    it('Can\'t update others comment', async () => {
      await request(app).put(`${BASE_PATH}/1`)
        .set('Authorization', users.user.token)
        .send({ comment: commentsMock.comment.comment })
        .expect(403)
    })

    it('Can delete own comment', async () => {
      await request(app).delete(`${BASE_PATH}/4`).set('Authorization', users.user.token).expect(200)
    })

    it('Can\'t delete others comment', async () => {
      await request(app).delete(`${BASE_PATH}/1`).set('Authorization', users.user.token).expect(403)
    })
  })

  describe('Editor', () => {
    it('Can get comments with post_id', async () => {
      const res = await request(app).get(BASE_PATH).set('Authorization', users.editor.token).query({
        post_id: commentsMock.comment.post_id,
      })
      isResponseOK(res)
      res.body.data.forEach(comment => {
        Object.keys(commentsMock.comment).forEach(k => expect(comment).toHaveProperty(k))
      })
    })

    it('Can\'t get comments without post_id', async () => {
      await request(app).get(BASE_PATH).set('Authorization', users.editor.token).expect(400)
    })

    it('Can create own comment', async () => {
      const res = await request(app).post(BASE_PATH).set('Authorization', users.editor.token).send({
        comment: commentsMock.comment.comment,
        post_id: commentsMock.comment.post_id,
      })
      isResponseOK(res)
      Object.keys(commentsMock.comment).forEach(k => expect(res.body.data).toHaveProperty(k))
    })

    it('Can update own comment', async () => {
      const res = await request(app).put(`${BASE_PATH}/2`)
        .set('Authorization', users.editor.token)
        .send({ comment: commentsMock.comment.comment })
      isResponseOK(res)
      Object.keys(commentsMock.comment).forEach(k => expect(res.body.data).toHaveProperty(k))
    })

    it('Can\'t update others comment', async () => {
      await request(app).put(`${BASE_PATH}/1`)
        .set('Authorization', users.editor.token)
        .send({ comment: commentsMock.comment.comment })
        .expect(403)
    })

    it('Can delete own comment', async () => {
      await request(app).delete(`${BASE_PATH}/2`).set('Authorization', users.editor.token).expect(200)
    })

    it('Can\'t delete others comment', async () => {
      await request(app).delete(`${BASE_PATH}/1`).set('Authorization', users.editor.token).expect(403)
    })
  })

  describe('Admin', () => {
    it('Can get comments with post_id', async () => {
      const res = await request(app).get(BASE_PATH).set('Authorization', users.admin.token).query({
        post_id: commentsMock.comment.post_id,
      })
      isResponseOK(res)
      res.body.data.forEach(comment => {
        Object.keys(commentsMock.comment).forEach(k => expect(comment).toHaveProperty(k))
      })
    })

    it('Can\'t get comments without post_id', async () => {
      await request(app).get(BASE_PATH).set('Authorization', users.admin.token).expect(400)
    })

    it('Can create own comment', async () => {
      const res = await request(app).post(BASE_PATH).set('Authorization', users.admin.token).send({
        comment: commentsMock.comment.comment,
        post_id: commentsMock.comment.post_id,
      })
      isResponseOK(res)
      Object.keys(commentsMock.comment).forEach(k => expect(res.body.data).toHaveProperty(k))
    })

    it('Can update any comment', async () => {
      const res1 = await request(app).put(`${BASE_PATH}/1`)
        .set('Authorization', users.admin.token)
        .send({ comment: commentsMock.comment.comment })
      isResponseOK(res1)
      Object.keys(commentsMock.comment).forEach(k => expect(res1.body.data).toHaveProperty(k))

      const res2 = await request(app).put(`${BASE_PATH}/3`)
        .set('Authorization', users.admin.token)
        .send({ comment: commentsMock.comment.comment })
      isResponseOK(res2)
      Object.keys(commentsMock.comment).forEach(k => expect(res2.body.data).toHaveProperty(k))
    })

    it('Can delete any comment', async () => {
      await request(app).delete(`${BASE_PATH}/1`).set('Authorization', users.admin.token).expect(200)
      await request(app).delete(`${BASE_PATH}/3`).set('Authorization', users.admin.token).expect(200)
    })
  })

})
