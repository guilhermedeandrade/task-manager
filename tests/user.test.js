const request = require('supertest')

const { userOneId, userOne, setupDatabase } = require('./fixtures/db')
const app = require('../src/app')
const User = require('../src/models/user')

beforeEach(setupDatabase)

it('should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Guilherme',
      email: 'guilherme@email.com',
      password: '1234567890',
    })
    .expect(201)

  const user = await User.findById(response.body.user._id)

  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    user: {
      name: 'Guilherme',
      email: 'guilherme@email.com',
    },
    token: user.tokens[0].token,
  })

  expect(user.password).not.toBe('1234567890')
})

it('should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200)

  const user = await User.findById(userOneId)

  expect(response.body.token).toEqual(user.tokens[1].token)
})

it('should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'wrong-password',
    })
    .expect(400)
})

it('should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

it('should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401)
})

it('should delete account for user', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(response.body._id)

  expect(user).toBeNull()
})

it('should not delete account for unauthenticated user', async () => {
  await request(app).delete('/users/me').send().expect(401)
})

it('should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/avatar.jpg')
    .expect(200)

  const user = await User.findById(userOneId)

  expect(user.avatar).toEqual(expect.any(Buffer))
})

it('should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name: 'Michael' })
    .expect(200)

  const user = await User.findById(userOneId)

  expect(user.name).toBe('Michael')
})

it('should not update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ location: 'Mars' })
    .expect(400)
})
