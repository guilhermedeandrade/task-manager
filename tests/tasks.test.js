const request = require('supertest')

const app = require('../src/app')
const Task = require('../src/models/task')
const { userOne, userTwo, taskOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

it('should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'From my test',
    })
    .expect(201)

  const task = await Task.findById(response.body._id)

  expect(task).not.toBeNull()
  expect(task.completed).toEqual(false)
})

it('should get tasks for user', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

  expect(response.body.length).toBe(2)
})

it('should not be able to delete others users task', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404)

  const task = await Task.findById(taskOne._id)

  expect(task).not.toBeNull()
})

