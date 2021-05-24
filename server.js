const express = require("express");
const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

const app = express();
const jsonParser = express.json();

// const allowCrossDomain = function(req, res, next) {
//   res.header('Content-Type', "application/json");
//   res.header('Access-Control-Allow-Origin', "*");
//   res.header('Access-Control-Allow-Methods', 'GET');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// }

// app.use(allowCrossDomain);
app.get("/api/redis/ping", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send("pong");
});

let status = 200;

// SECTION Set and get key - value

app.get("/api/redis/getByKey", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  const query = req.query;

  try {
    client.get(query.key, function (err, result) {
      const response = {
        [query.key]: result,
      };

      return res.status(status).json({ data: response }).end();
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(`Request error: ${err}`).end();
  }
});

app.post("/api/redis/setByKey", jsonParser, async (req, res, next) => {
  if (!req.body) return res.status(400).send("Body is empty!").end();
  const params = req.body;

  try {
    await client.set(params.key, params.value);

    await client.get(params.key, function (err, result) {
      const response = {
        [params.key]: result,
      };

      return res.status(status).json(response).end();
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(`Request error: ${err}`).end();
  }
});

app.post("/api/redis/delByKey", jsonParser, async (req, res, next) => {
  if (!req.body) return res.status(400).send("Body is empty!").end();
  const params = req.body;

  try {
    await client.del(params.key);

    return res.status(status).end();
  } catch (err) {
    console.log(err);
    res.status(400).send(`Request error: ${err}`).end();
  }
});

// SECTION List of users

// ANCHOR list of user's guid
app.get("/api/redis/getUsersIds", (req, res) => {
  client.lrange("users", 0, -1, (err, result) => {
    if (err) {
      return res.status(500).send("Error");
    }

    return res.status(status).json({ data: result }).end();
  });
});

// ANCHOR get all users
app.get("/api/redis/getUsers", (req, res) => {
  const multi = client.multi();

  multi.lrange("users", 0, -1);

  multi.exec((err, result) => {
    if (err) {
      return res.status(500).send("Error");
    }

    const users = result[0];

    const commands = users.map((user) => ["hgetall", user]);

    client.multi(commands).exec((err, usersList) => {
      return res.status(status).json({ data: usersList }).end();
    });
  });
});

// ANCHOR get user by id
app.get("/api/redis/getUser", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  const query = req.query;

  try {
    client.hgetall(query.user, function (err, result) {
      if (err) {
        return res.status(500).send("Error");
      }

      return res.status(status).json({ data: result }).end();
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(`Request error: ${err}`).end();
  }
});

// ANCHOR add user
app.post("/api/redis/addUser", jsonParser, async (req, res, next) => {
  if (!req.body) return res.status(400).send("Body is empty!").end();
  const params = req.body;

  try {
    const guid = getGuid();

    await addUser(guid);

    await client.hmset(guid, { ...params, id: guid }, (err, result) => {
      if (err) {
        res.status(500).send(`Request error: ${err}`).end();
      } else {
        return res.status(status).json(result).end();
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(`Request error: ${err}`).end();
  }
});

// ANCHOR delete user by id
app.post("/api/redis/delUser", jsonParser, (req, res, next) => {
  if (!req.body) return res.status(400).send("Body is empty!").end();

  const params = req.body;

  try {
    client.hdel(params.id, function (err, result) {
      removeUser(params.id);

      return res.status(status).end();
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(`Request error: ${err}`).end();
  }
});

// SECTION Utils

function addUser(userGuid) {
  client.rpush("users", userGuid, (err, data) => {
    if (err) {
      return res.status(500).send("Error");
    }
  });
}

function removeUser(userGuid) {
  client.lrem("users", 1, userGuid, (err, data) => {
    if (err) {
      return res.status(500).send("Error");
    }
  });
}

function getGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (16 * Math.random()) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
