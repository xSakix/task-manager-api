const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/tasks");
const {
  userOneID,
  userOne,
  setupDatabase,
  userTwo,
  taskOne,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("should create task for user", async () => {
  const taskObj = {
    description: "test task",
    completed: false,
  };
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(taskObj)
    .expect(201);

  expect(response.body).toBeDefined();
  expect(response.body).toMatchObject(taskObj);

  const task = await Task.findById(response.body._id);
  expect(task).toBeDefined();
  expect(task).not.toBeNull();
  expect(task).toMatchObject(taskObj);
  expect(task.description).toEqual(taskObj.description);
});

test("request all user tasks for user one", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body).toBeDefined();
  expect(response.body.length).toBe(2);
});

test("Second user is trying to delete first task of first user", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

    const task = await Task.findById(taskOne._id);
    expect(task).toBeDefined();
    expect(task).not.toBeNull();
});


//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks