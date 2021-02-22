const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/users");
const { userOneID, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test("Should sign up a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Martin",
      email: "test@example.com",
      password: "MyPass777!",
    })
    .expect(201);

  //db assers
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  expect(user.tokens).toBeDefined();
  expect(user.tokens.length).toBe(1);

  //response body assert
  //expect(response.body.user.name).toBe('Martin');
  expect(response.body).toMatchObject({
    user: {
      name: "Martin",
      email: "test@example.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("MyPass777!");
});

test("should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  expect(response.body).toBeDefined();
  expect(response.body.user).toBeDefined();
  expect(response.body.token).toBeDefined();

  const user = await User.findById(userOneID);
  expect(user).toBeDefined();
  expect(user).not.toBeNull();
  expect(user.tokens).toBeDefined();
  expect(user.tokens.length).toBe(2);
  expect(user.tokens[1].token).toBe(response.body.token);
});

test("should fail to login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "none@none.com",
      password: "None1234!@",
    })
    .expect(400);
});

test("should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer invalid token`)
    .send()
    .expect(401);
});

test("Should delete users account", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneID);
  expect(user).toBeNull();
});

test("Should not delete unauthenticated users account", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer fake token`)
    .send()
    .expect(401);
});

test("should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneID);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should update valid user fields", async () => {
  const update = {
    name: "Martin",
    age: 10,
  };
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(update)
    .expect(200);

  expect(response.body).toBeDefined();
  expect(response.body).toMatchObject(update);

  const user = await User.findById(userOneID);
  expect(user).toBeDefined();
  expect(user).not.toBeNull();
  expect(user).toMatchObject(update);
});

test("should not update invalid user data", async () => {
  const update = {
    location: "Martin",
  };
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(update)
    .expect(400);
});


//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated