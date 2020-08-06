const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@email.com',
  password: 'random-pw-123',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
}

const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
  _id: userTwoId,
  name: 'Michal',
  email: 'michael@email.com',
  password: 'random-pw-456',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
}

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOne._id,
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: true,
  owner: userOne._id,
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: true,
  owner: userTwo._id,
}

const setupDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()

  const firstUser = new User(userOne)
  await firstUser.save()

  const secondUser = new User(userTwo)
  await secondUser.save()

  const firstTask = new Task(taskOne)
  await firstTask.save()

  const secondTask = new Task(taskTwo)
  await secondTask.save()

  const thirdTask = new Task(taskThree)
  await thirdTask.save()
}

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
}
