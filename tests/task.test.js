const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { setupDatabase, userOne, userTwoId, taskOne } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.description).toEqual('From my test')
    expect(task.completed).toEqual(false)
})

test('Get task for a user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Test delete task security', async () => {
    await request(app)
        .delete('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userTwoId}`)
        .expect(401)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})