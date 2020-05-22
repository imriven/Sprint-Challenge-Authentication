const request = require("supertest");

const server = require("./server.js");

const db = require("../database/dbConfig");

beforeEach(async () => {
  await db("users").truncate();
});
//clears users table before each test

describe("server.js", () => {
  describe("register", () => {
    it("should successfully register user", async () => {
      const user = {
        username: "test2",
        password: "testvalues",
      };
      const expectedStatusCode = 201;
      const response = await request(server)
        .post("/api/auth/register")
        .send(user);
      expect(response.status).toEqual(expectedStatusCode);
    });

    it("it should error without password", async () => {
      const user = {
        username: "test2",
      };
      const expectedStatusCode = 500;
      const response = await request(server)
        .post("/api/auth/register")
        .send(user);
      expect(response.status).toEqual(expectedStatusCode);
    });
  });

  describe("login", () => {
    it("should successfully login", async () => {
      const expectedStatusCode = 200;
      const user = {
        username: "test2",
        password: "testvalues",
      };
      const registerResponse = await request(server)
        .post("/api/auth/register")
        .send(user);
      const response = await request(server).post("/api/auth/login").send(user);
      expect(response.status).toEqual(expectedStatusCode);
    });

    it("it rejects bad password", async () => {
      const expectedStatusCode = 401;
      const user = {
        username: "test2",
        password: "testvalues",
      };
      const registerResponse = await request(server)
        .post("/api/auth/register")
        .send(user);
      const response = await request(server)
        .post("/api/auth/login")
        .send({ ...user, password: "test" });
      expect(response.status).toEqual(expectedStatusCode);
    });
  });

  describe("jokes", () => {
    it("should return a list of jokes", async () => {
      const expectedStatusCode = 200;
      const user = {
        username: "test2",
        password: "testvalues",
      };
      const registerResponse = await request(server)
        .post("/api/auth/register")
        .send(user);
      const loginResponse = await request(server)
        .post("/api/auth/login")
        .send(user);
      const token = loginResponse.body.token;
      const response = await request(server)
        .get("/api/jokes")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(expectedStatusCode);
    });

    it("should return 401 not logged in", async () => {
      const expectedStatusCode = 401;
      const response = await request(server).get("/api/jokes");
      expect(response.status).toEqual(expectedStatusCode);
    });
  });
});
