const request = require('supertest')
const app = require('../../server')
const { isResponseOK, getTokens } = require('../utils')
const { postsMock } = require('../mocks')

const BASE_PATH = '/api/posts'

let users = {}

beforeAll(async () => {
  users = await getTokens()
})

describe('Posts route', () => {

  describe('Guest', () => {
    it('Can get all public posts', async () => {
      const res = await request(app).get(BASE_PATH)
      isResponseOK(res)
      res.body.data.slice(0, 10).forEach(postRes => {
        Object.keys(postsMock.publicPost).forEach(k => expect(postRes).toHaveProperty(k))
        expect(postRes.private).toBeFalsy()
      })
    })

    it('Can get a public post', async () => {
      const postRes = await request(app).get(`${BASE_PATH}/2`)
      Object.keys(postsMock.publicPost).forEach(k => expect(postRes.body.data).toHaveProperty(k))
      expect(postRes.body.data.private).toBeFalsy()
    })

    it('Can\'t get a private post', async () => {
      await request(app).get(`${BASE_PATH}/1`).expect(403)
    })

    it('Can\'t create a post', async () => {
      await request(app).post(BASE_PATH).send({
        title: postsMock.publicPost.title,
        content: postsMock.publicPost.content,
        private: postsMock.publicPost.private,
      }).expect(403)
      await request(app).post(BASE_PATH).send({
        title: postsMock.privatePost.title,
        content: postsMock.privatePost.content,
        private: postsMock.privatePost.private,
      }).expect(403)
    })

    it('Can\'t update any post', async () => {
      await request(app).put(`${BASE_PATH}/1`).send({ content: postsMock.publicPost.content }).expect(403)
      await request(app).put(`${BASE_PATH}/2`).send({ content: postsMock.publicPost.content }).expect(403)
      await request(app).put(`${BASE_PATH}/3`).send({ content: postsMock.publicPost.content }).expect(403)
    })

    it('Can\'t delete any post', async () => {
      await request(app).delete(`${BASE_PATH}/1`).expect(403)
      await request(app).delete(`${BASE_PATH}/2`).expect(403)
      await request(app).delete(`${BASE_PATH}/3`).expect(403)
    })
  })

  describe('User', () => {
    it('Can get all public and private posts', async () => {
      const res = await request(app).get(BASE_PATH).set('Authorization', users.user.token)
      isResponseOK(res)
      expect(res.body.data.find(p => p.id === '1').private).toBeTruthy()
      expect(res.body.data.find(p => p.id === '2').private).toBeFalsy()
    })

    it('Can\'t create a public post', async () => {
      await request(app).post(BASE_PATH).set('Authorization', users.user.token).send({
        title: postsMock.publicPost.title,
        content: postsMock.publicPost.content,
        private: postsMock.publicPost.private,
      }).expect(403)
    })

    it('Can\'t create a private post', async () => {
      await request(app).post(BASE_PATH).set('Authorization', users.user.token).send({
        title: postsMock.privatePost.title,
        content: postsMock.privatePost.content,
        private: postsMock.privatePost.private,
      }).expect(403)
    })

    it('Can\'t update others posts', async () => {
      await request(app)
        .put(`${BASE_PATH}/1`)
        .set('Authorization', users.user.token)
        .send({
          private: postsMock.privatePost.private,
          content: postsMock.publicPost.content + '_updated',
        })
        .expect(403)
    })

    it('Can\'t delete others posts', async () => {
      await request(app).delete(`${BASE_PATH}/1`).set('Authorization', users.user.token).expect(403)
    })
  })

  describe('Editor', () => {
    it('Can get all public and private posts', async () => {
      const res = await request(app).get(BASE_PATH).set('Authorization', users.editor.token)
      isResponseOK(res)
      expect(res.body.data.find(p => p.id === '1').private).toBeTruthy()
      expect(res.body.data.find(p => p.id === '2').private).toBeFalsy()
    })

    it('Can create a public post', async () => {
      const newPost = await request(app).post(BASE_PATH).set('Authorization', users.editor.token).send({
        title: postsMock.publicPost.title,
        content: postsMock.publicPost.content,
        private: postsMock.publicPost.private,
      })
      const retrieveNewPost = await request(app).get(`${BASE_PATH}/${newPost.body.data.id}`).set('Authorization', users.editor.token)
      isResponseOK(newPost)
      isResponseOK(retrieveNewPost)
      Object.keys(postsMock.publicPost).forEach(k => expect(newPost.body.data).toHaveProperty(k))
      Object.keys(postsMock.publicPost).forEach(k => expect(retrieveNewPost.body.data).toHaveProperty(k))
      expect(newPost.body.data.private).toBeFalsy()
      expect(retrieveNewPost.body.data.private).toBeFalsy()
    })

    it('Can create a private post', async () => {
      const newPost = await request(app).post(BASE_PATH).set('Authorization', users.editor.token).send({
        title: postsMock.privatePost.title,
        content: postsMock.privatePost.content,
        private: postsMock.privatePost.private,
      })
      const retrieveNewPost = await request(app).get(`${BASE_PATH}/${newPost.body.data.id}`).set('Authorization', users.editor.token)
      isResponseOK(newPost)
      isResponseOK(retrieveNewPost)
      Object.keys(postsMock.privatePost).forEach(k => expect(newPost.body.data).toHaveProperty(k))
      Object.keys(postsMock.privatePost).forEach(k => expect(retrieveNewPost.body.data).toHaveProperty(k))
      expect(newPost.body.data.private).toBeTruthy()
      expect(retrieveNewPost.body.data.private).toBeTruthy()
    })

    it('Correct validation of post creation', async () => {
      await request(app).post(BASE_PATH).set('Authorization', users.editor.token).send({
        content: postsMock.privatePost.content,
        private: postsMock.privatePost.private,
      }).expect(400)
      await request(app).post(BASE_PATH).set('Authorization', users.editor.token).send({
        title: postsMock.privatePost.title,
        private: postsMock.privatePost.private,
      }).expect(400)
      await request(app).post(BASE_PATH).set('Authorization', users.editor.token).send({
        title: postsMock.privatePost.title,
        content: postsMock.privatePost.content,
      }).expect(400)
    })

    it('Can update own post', async () => {
      const updatedPost = await request(app)
        .put(`${BASE_PATH}/2`)
        .set('Authorization', users.editor.token)
        .send({
          private: postsMock.privatePost.private,
          content: postsMock.publicPost.content + '_updated',
        })
      isResponseOK(updatedPost)
      expect(updatedPost.body.data.private).toEqual(postsMock.privatePost.private)
      expect(updatedPost.body.data.content).toEqual(postsMock.publicPost.content + '_updated')

      const reupdatedPost = await request(app)
        .put(`${BASE_PATH}/2`)
        .set('Authorization', users.editor.token)
        .send({
          private: postsMock.publicPost.private,
          content: postsMock.publicPost.content,
        })
      isResponseOK(updatedPost)
      expect(reupdatedPost.body.data.private).toEqual(postsMock.publicPost.private)
      expect(reupdatedPost.body.data.content).toEqual(postsMock.publicPost.content)
    })

    it('Can\'t update others posts', async () => {
      await request(app)
        .put(`${BASE_PATH}/1`)
        .set('Authorization', users.editor.token)
        .send({
          private: postsMock.privatePost.private,
          content: postsMock.publicPost.content + '_updated',
        })
        .expect(403)
    })

    it('Can delete own post', async () => {
      await request(app).delete(`${BASE_PATH}/2`).set('Authorization', users.editor.token).expect(200)
      await request(app).get(`${BASE_PATH}/2`).set('Authorization', users.editor.token).expect(404)
    })

    it('Can\'t delete others posts', async () => {
      await request(app).delete(`${BASE_PATH}/1`).set('Authorization', users.editor.token).expect(403)
    })
  })

  describe('Admin', () => {
    it('Can get all public and private posts', async () => {
      const res = await request(app).get(BASE_PATH).set('Authorization', users.admin.token)
      isResponseOK(res)
      expect(res.body.data.find(p => p.id === '1').private).toBeTruthy()
      expect(res.body.data.find(p => p.id === '3').private).toBeFalsy()
    })

    it('Can create a public post', async () => {
      const newPost = await request(app).post(BASE_PATH).set('Authorization', users.admin.token).send({
        title: postsMock.publicPost.title,
        content: postsMock.publicPost.content,
        private: postsMock.publicPost.private,
      })
      const retrieveNewPost = await request(app).get(`${BASE_PATH}/${newPost.body.data.id}`).set('Authorization', users.admin.token)
      isResponseOK(newPost)
      isResponseOK(retrieveNewPost)
      Object.keys(postsMock.publicPost).forEach(k => expect(newPost.body.data).toHaveProperty(k))
      Object.keys(postsMock.publicPost).forEach(k => expect(retrieveNewPost.body.data).toHaveProperty(k))
      expect(newPost.body.data.private).toBeFalsy()
      expect(retrieveNewPost.body.data.private).toBeFalsy()
    })

    it('Can create a private post', async () => {
      const newPost = await request(app).post(BASE_PATH).set('Authorization', users.admin.token).send({
        title: postsMock.privatePost.title,
        content: postsMock.privatePost.content,
        private: postsMock.privatePost.private,
      })
      const retrieveNewPost = await request(app).get(`${BASE_PATH}/${newPost.body.data.id}`).set('Authorization', users.admin.token)
      isResponseOK(newPost)
      isResponseOK(retrieveNewPost)
      Object.keys(postsMock.privatePost).forEach(k => expect(newPost.body.data).toHaveProperty(k))
      Object.keys(postsMock.privatePost).forEach(k => expect(retrieveNewPost.body.data).toHaveProperty(k))
      expect(newPost.body.data.private).toBeTruthy()
      expect(retrieveNewPost.body.data.private).toBeTruthy()
    })

    it('Can update own post', async () => {
      const updatedPost = await request(app)
        .put(`${BASE_PATH}/1`)
        .set('Authorization', users.admin.token)
        .send({
          private: postsMock.privatePost.private,
          content: postsMock.publicPost.content + '_updated',
        })
      isResponseOK(updatedPost)
      expect(updatedPost.body.data.private).toEqual(postsMock.privatePost.private)
      expect(updatedPost.body.data.content).toEqual(postsMock.publicPost.content + '_updated')

      const reupdatedPost = await request(app)
        .put(`${BASE_PATH}/1`)
        .set('Authorization', users.admin.token)
        .send({
          private: postsMock.publicPost.private,
          content: postsMock.publicPost.content,
        })
      isResponseOK(updatedPost)
      expect(reupdatedPost.body.data.private).toEqual(postsMock.publicPost.private)
      expect(reupdatedPost.body.data.content).toEqual(postsMock.publicPost.content)
    })

    it('Can update others posts', async () => {
      const updatedPost = await request(app)
        .put(`${BASE_PATH}/3`)
        .set('Authorization', users.admin.token)
        .send({
          private: postsMock.privatePost.private,
          content: postsMock.publicPost.content + '_updated',
        })
      isResponseOK(updatedPost)
      expect(updatedPost.body.data.private).toEqual(postsMock.privatePost.private)
      expect(updatedPost.body.data.content).toEqual(postsMock.publicPost.content + '_updated')

      const reupdatedPost = await request(app)
        .put(`${BASE_PATH}/3`)
        .set('Authorization', users.admin.token)
        .send({
          private: postsMock.publicPost.private,
          content: postsMock.publicPost.content,
        })
      isResponseOK(updatedPost)
      expect(reupdatedPost.body.data.private).toEqual(postsMock.publicPost.private)
      expect(reupdatedPost.body.data.content).toEqual(postsMock.publicPost.content)
    })

    it('Can delete own post', async () => {
      await request(app).delete(`${BASE_PATH}/1`).set('Authorization', users.admin.token).expect(200)
      await request(app).get(`${BASE_PATH}/1`).set('Authorization', users.admin.token).expect(404)
    })

    it('Can delete others posts', async () => {
      await request(app).delete(`${BASE_PATH}/3`).set('Authorization', users.admin.token).expect(200)
      await request(app).get(`${BASE_PATH}/3`).set('Authorization', users.admin.token).expect(404)
    })
  })

})
