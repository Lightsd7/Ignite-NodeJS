const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");
const res = require("express/lib/response");
const req = require("express/lib/request");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "Username not found" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists!" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };
  users.push(user);
  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todos = user.todos;
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return response.status(404).json({ error: "Todo not exist" });
  }
  // if (user.todo.id === id) {
  //   user.todo.title = title;
  //   user.todo.deadline = deadline;
  // }
  todo.title = title;
  todo.deadline = deadline;

  return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todos = user.todos;
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return response.status(404).json({ error: "Todo not exists" });
  }
  todo.done = true;
  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todos = user.todos;
  const todo = todos.find((todo) => todo.id === id);
  if (!todo) {
    return response.status(404).json({ error: "Todo not exists" });
  }

  const todo2 = todos.findIndex((todo) => todo.id === id);
  todos.splice(todo2, 1);
  return response.status(204).json();
});

module.exports = app;
