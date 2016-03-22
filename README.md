# Notes on *Scott Moss' Workshop: `Node` API Design*

Design, build, test and deploy a RESTful API for a blogging app with authentication using `Node` and `Mongo`

## Tools and Resources

### Loggers

- [`Morgan`](https://github.com/expressjs/morgan): Log on all the `requests` as they come in.
- [`Bunyam`](https://github.com/trentm/node-bunyan)
- [`Winston`](https://github.com/winstonjs/winston)

### Command Line

- [`HTTPie`](https://github.com/jkbrzt/httpie): Amazing CLI to play with APIs.

### REST APIs

- [Parse] (https://parse.com/docs/rest/guide): A nice real-world example of a REST API.

### Testing

- [`Mocha`](https://mochajs.org/)
- [`Chai`](http://chaijs.com/)
- [`Tape`](https://github.com/substack/tape)
- [`Supertest`](https://github.com/visionmedia/supertest): Originally designed to work with `Express`.

### Databases

- [`Robomongo`](https://robomongo.org/): Native and cross-platform `MongoDB` manager.
- [`OrientDB`](http://orientdb.com/orientdb/): 2nd Generation Distributed Graph Database.
- [`Moongose` `API` Docs](http://mongoosejs.com/docs/api.html)

### Promises

- [`BlueBird.js`](http://bluebirdjs.com/docs/getting-started.html): Very performant `promises` library.
- [`Moongose` Built-in Promises](http://mongoosejs.com/docs/promises.html)

### Authentication

- [JWT](http://jwt.io/): `JWT.IO` allows you to decode, verify and generate `JWT`.
- [`passport`](http://passportjs.org/): Simple, unobtrusive authentication for `Node`
- [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken): An implementation of JSON Web Tokens for `Node`.
- [`express-jwt`](https://github.com/auth0/express-jwt): `Express` `middleware` that validates a `JWT` and set the `req.user` with the attributes

### Others

- [`cors`](https://github.com/expressjs/cors): `Express` `middleware` to enable `Cross Origin Resource Sharing` (`CORS`)
- [`method-override`](https://github.com/expressjs/method-override): Lets you use `HTTP` verbs such as `PUT` or `DELETE` in places where the client doesn't support it
- [`node-slug`](https://github.com/dodo/node-slug): `slug`ifies even utf-8 chars
- [Scott's Notes](http://fem-node-api.netlify.com/)
- [Scott's Code](https://github.com/FrontendMasters/api-design-node)
- [Scott's frontend](https://github.com/FrontendMasters/angular-components/tree/blog)

### Extra stuff

- [James Kyle's Example Node Server](https://github.com/babel/example-node-server): Example Node Server with Babel 6.
- [Boilerplate Express/ES2015/Mocha/MongoDB API](https://github.com/dbuarque/basic-express-api): `Express`, `ES2015`, `Mocha`, `MongoDB` `API` Boilerplate
- [babel-preset-es2015-node5](https://github.com/alekseykulikov/babel-preset-es2015-node5): Babel preset to make node@5 fully ES2015 compatible.
- [Misunderstanding ES6 Modules, Upgrading Babel, Tears, and a Solution](https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0#.p4pgmlc2h)

## 1. `Node`

### `Node` refresher

- `Node` is basically a way to run javascript outside the context of the browser.
- To get started just type `node` in your terminal and you'll have a full `REPL`.

### `CommonJS`

#### How to access `node` modules

Use `require()` to get access to:

- Built in `node` modules.
- 3rd party `npm` modules.
- Our own modules.

```node
// built in node module
const path = require('path');

// 3rd party module downloaded into node_modules/
const _ = require('lodash');

// a module we created in another file
const myModule = require('./path/to/my/module');
```

#### How to expose `node` modules

Use the `exports` object to expose our own `node` modules.

**Selecting individual properties**

```node
// yourfile.js
exports.setup = () => {};
exports.enable = () => {};
exports.ready = true;
```

**Using `module.exports`**

```node
// yourfile.js
module.exports = {
  setup: () => {},
  enable: () => {},
  ready: true
};
```

#### Differences between `exports` and `module.exports`

- When using `exports` the module will be exported as an `object`.
- When using `module.exports` you can export whatever you want (an `object`, a `function`, a `number`, ...).

#### `ES2015` modules

There's still no *native* support, yet, but it's coming:

```console
✔ node --version
v5.7.0
✔ node --v8-options | grep "in progress"
  --harmony_modules (enable "harmony modules" (in progress))
```

Use `babel` meanwhile

#### How does `Node` execute your code

When `Node` executes your files it previously wrap them in [`IIFE`](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)s (*Immediately Invoked Function Expression*):

```node
(function (module, exports, __dirname, ....) {
  YOUR CODE GOES HERE
}())
```

### `Express`

- `Node` has a built-in [`http`](https://nodejs.org/api/http.html) module that allows us to create servers, but you need to write too much code for that.
- [`Express`](http://expressjs.com/) framework:
	- Sits on top of `Node`
	- Uses the `http` `Node` module.
	- Is composed of `routing` and `middleware`.
	- Allows to register `callbacks` for `routes` with different `http` verbs.
- Other popular choices are [`Koa`](http://koajs.com/), [`Hapi`](http://hapijs.com/) and [`Sails`](http://sailsjs.org/).

### Very basic `express` server boilerplate

```node
const express = require('express');

const app = express();

// on GET request to the url
app.get('/todos', (req, res) => {

});

// on POST request to the same url
app.post('/todos', (req, res) => {

});

// start server on port 3000
app.listen(3000);
```

### Using `req.send` vs `req.json`

```node
app.get('/todos', (req, res) => {
  res.json(todos);
});
```

**`res.json`**:

- sends back a `json` `response`.
- converts `null` and `undefined` to `json` (although it's not *valid* `json`).

```node
app.get('/todos', (req, res) => {
  res.send(todos);
});
```

**`res.send`**:

- sends back a `json` `response`.
- **DOES NOT** convert `null` and `undefined` to `json`.

You need at least one function (you can define more than one) for every request type.

### `Middleware`

`Express` uses `middleware` to modify and inspect the incoming `request`.

Tons of community made `middleware`, for:

-  parsing urls,
-  handing auth,
-  serve static assets,
-  ...

#### What is a `middleware`?

A `middleware` is just a composable function.

The `callback` function that handles the `get` `request` at the `/todos` `route`, technically, is `middleware` too:

```node
app.get('/todos', (req, res) => { 'I AM MIDDLEWARE, TOO!' });
```

### Exercise 1 Notes

Create a basic server with `express`, that:

  - sends back the `index.html` file on a `GET` to `'/'`
  - sends back `jsonData` on a `GET` to `'/data'`


First thing to do after cloning a new `Node` repo:

```console
✔ npm install
```

- The [`fs`](https://nodejs.org/api/fs.html) node module.
- The [`path`](https://nodejs.org/api/path.html) node module.

### Serving the `index.html` file

#### Using `res.sendFile`

```node
const path = require('path');

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
```

#### Using `fs.readFile`

```node
const fs = require('fs');

app.get('/', (_, res) => {
  fs.readFile('index.html', (_, buffer) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(buffer.toString());
  });
});
```

#### Note

Internally `res.sendFile` is leveraging `fs.readFile`.

### Enter `Babel` and `ESLint`

You need to install all these modules *per project*...

```console
✔ npm install --save-dev babel-cli babel-core babel-eslint babel-preset-es2015 babel-preset-stage-2 eslint eslint-config-airbnb eslint-plugin-babel eslint-plugin-react
```

...and *globally* install all these modules to keep `Spacemacs` happy (just once per `node` version):

```console
✔ npm install -g babel-eslint eslint eslint-config-airbnb eslint-plugin-babel eslint-plugin-react js-beautify tern
```

Also, remember to copy a `.babelrc` file and a `eslint.json` file.

`.babelrc`

```
{
  "presets": ["es2015", "stage-2"]
}
```

`eslint.json`

```json
{
  "extends": "airbnb",
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "ecmaFeatures": {
    "forOf": true,
    "jsx": true,
    "modules": true,
    "es6": true
  },
  "parser": "babel-eslint",
  "rules": {
    "arrow-body-style": 0,
    "comma-dangle": 0,
    "indent": [2, 2, {"SwitchCase": 1}],
    "new-cap": [2, {
      "capIsNewExceptions": [
        "Immutable.Map",
        "Map",
        "Immutable.Set",
        "Set",
        "Immutable.List",
        "List"
      ]
    }],
    "no-multi-spaces": [2, {
      "exceptions": {
        "ImportDeclaration": true,
        "VariableDeclarator": true
      }
    }],
    "space-before-function-paren": [2, "always"],
    "quote-props": [2, "consistent-as-needed"],

    "babel/generator-star-spacing": 1,
    "babel/new-cap": 1,
    "babel/object-shorthand": 1,
    "babel/arrow-parens": 1,
    "babel/no-await-in-loop": 1
  },
  "plugins": [
    "babel",
    "react"
  ]
}
```


## 2. REST APIs

### About RESTful Services

- Stateless requests.
- Use HTTP verbs explicitly.
- Expose a directory-like url-pattern for the `routes` (matching resources).
- Transfer `JSON` (or `XML`).

### Anatomy of a REST API

#### 1st. Determine what the actual `resource` looks like

We are going to model a `lion` `resource` with `name`, `id`, `age`, `pride` and `gender` properties.


#### 2nd. Model the `resource` in `JSON`

An example of a `lion` `resource` in `JSON`:

```json
{
  "name": "Simba",
  "id": 1,
  "age": 3,
  "pride": "the cool cats",
  "gender": "male"
}
```

#### 3rd. Design the `routes` to access the `resource`

Use the HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) to perfom `CREATE`, `READ`, `UPDATE`, `DELETE` operations on our `resource`.

For a `lion` `resource` it could be something like this:

- `"GET /lions"`
- `"GET /lions/:id"`
- `"POST /lions"`
- `"PUT /lions/:id"`
- `"DELETE /lions/:id"`

#### 4th. Model the `routes` for the `resource` in `JSON`

An example of the `routes` for a `lion` `resource`:

```json
{
  "GET /lions": {
    "desc": "return all lions",
    "response": "200 application/json",
    "data": [{}, {}, {}]
  },

  "GET /lions/:id": {
    "desc": "return the lion that matches id",
    "response": "200 application/json",
    "data": {}
  },

  "POST /lions": {
    "desc": "create and return a new lion with the posted data",
    "response": "201 application/json",
    "data": {}
  },

  "PUT /lions/:id": {
    "desc": "update and return the lion that matches id with the posted update object",
    "response": "200 application/json",
    "data": {}
  },

  "DELETE /lions/:id": {
    "desc": "delete and return the lion that matches id",
    "response": "200 application/json",
    "data": {}
  }
}
```

#### 5th. Start Building the API with `Express`

**"GET /lions"**

```node
app.get('/lions', (_, res) => {
  res.json(lions);
});
```

**"GET /lions/:id"**

```node
app.get('/lions/:id', (req, res) => {
  const lionId = req.params.id;
  res.json(
    lions.filter((lion) => lion.id === lionId)[0]);
});
```

**"POST /lions"**

```node
app.post('/lions', (req, res) => {
  const assembleNewLion = () => {
    id += 1;
    return { ...req.body, id: id.toString(10) };
  };

  const lion = assembleNewLion();
  lions = [...lions, lion];

  res.json(lion);
});
```

**"PUT /lions/:id"**

```node
app.put('/lions/:id', (req, res) => {
  const updateData = req.body;
  const lionId = req.params.id;
  let updatedLion = undefined;

  // In case you try to modify the id
  if (updateData.id) { delete updateData.id; }

  lions = lions.map((lion) => {
    if (lion.id !== lionId) { return lion; }

    updatedLion = { ...lion, ...updateData };
    return updatedLion;
  });

  updatedLion
    ? res.json(updatedLion)
    : res.send();
});
```

**"DELETE /lions/:id"**

```node
app.delete('/lions/:id', (req, res) => {
  const lionId = req.params.id;
  let deletedLion = undefined;

  lions = lions.map((lion) => {
    if (lion.id !== lionId) { return lion; }

    deletedLion = lion;
    return deletedLion;
  });

  deletedLion
    ? res.json(deletedLion)
    : res.send();
});
```

### Exercise 2

#### `app.use(middlewareFunction)`

```node
const app = express();
app.use(middleware1);
app.use(middleware2);
app.use(middleware3);
```

Register `middleware`s and execute them in order.

#### `express.static(dirPath)` `middleware`

It's a built-in `Express` middleware that will serve as a static resource:

- Everything within the passed `dirPath`.
- `index.html` (at the root of `dirPath`) on a `GET` to `'/'`.

Also sets the `MIME` type based on each file's extension.

**Example**:

```node
const app = express();
app.use(express.static('client'));
```

#### `bodyParser` `middleware`

Make it possible to send `JSON` to the server, that can lately be accessed as `req.body`.

`Express` by itself doesn't know how to treat `JSON`.

```node
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
```

#### Validations

Validate in the DB (I'm not sure about this).


## 3. `Middleware`

### What is `middleware`?

`Middleware` is a function with access to:

- the `request` object
- the `response` object
- the `next` function (when called will go to the next `middleware`)

### What a `middleware` can do?

`Middleware`s can:

- run any code
- change the `request` object
- change the `response` object
- end the `request`-`response` cycle
- call the next `middleware` in the stack

### The `next` function

The server will hang if a `middleware`:

- does not call `next()` (invoking the next `middleware` in the stack)

**OR**

- end the `request`-`response` cycle

### `Middleware` types in `Express` 4.x

There are 5 different types of `middleware` in `Express` 4.x:

- 3rd party
- Built-in `express.*`
- Application level
- Router level
- Error-handling `(err, req, res, next) => {}`

### Using `middleware`s

- We can apply any `middleware` at the `route` level, like so:

```node
import checkAuth from './util/checkauth';

app.get('/todos', checkAuth(), (req, res) => { .... });
```
- We can register `middleware` at the `application` level with `.use()`:

```node
import morgan from 'morgan';

app.use(morgan());
```

### GOTCHA defining and registering `middleware`s

#### Scenario 1

This `options` `middleware`:

```node
const options = (req, res, next) => {
  ....
  next();
};
```

is registered like this (passing the function as an argument):

```node
app.use(options);
```

#### Scenario 2 (used by most 3rd party `middleware`)

This `options` `middleware` is a wrapper of the actual `middleware` (the inner anonymous function):

```node
const options = (opts) => {
  return (req, res, next) => {
    ....
    next();
  };
};
```

and is registered like this (invoking the function as an argument):

```node
app.use(options({ prop: 'whatever' }));
```


### `app.param`

```node
app.param('id', (req, res, next, id) => { .... });
```

`app.param` will run its callback if it detects a query parameter with the given name (in the example `:id`).

### Routers

Kind of a composed router.

```node
import express from 'express';

const app = express();
const lionsRouter = express.Router();

lionsRouter.get('/', (req, res) => { res.json(lions); });

app.use('/lions', lionsRouter);
```

- The `lionsRouter` is mounted to the `'/lions'` url, using `app.use()`.
- The root of `lionsRouter` is not '`/`', it's whatever is mounted in it (in this case `'/lions'`).

### Custom `middleware` to log whatever

```node
app.use((req, res, next) => {
  console.log('The body: ', req.body);
  next();
});
```


## 4. Testing

- Extract the `App` from the file where you *start* the server, so the `App`:
	- can be exported (`export default App`),
	- can be imported by tests (`import App from './App'`) if necessary.

### `Node` environment variables

- There's a global object in `Node` called `process.env`.
- We can access our environment variables on this object.
- A useful one is `process.env.NODE_ENV`.

### The special meaning of `index.js` in `Node`

If you have a file by the name of `index.js` in a directory, you can just `require` that directory and it would automacially give you the `index.js`.

### Test setup

```console
✔ npm install --save-dev chai mocha supertest
```

```json
"scripts": {
  "start": "nodemon index.js --exec babel-node",
  "lint": "eslint .",
    "test": "mocha --compilers js:babel-register ./server"
}
```

- `Mocha` as the test runner (`describe`, `context`, `it`).
- `Supertest` managing the `http` related bits.
- `Chai` as an assertion library.


## 5. Organization and Configuration

### Aplication organization

Different components to support:

- The `API`
- Authentication
- Static serving

### What is the `API`?

The `API` is a collection of `resources` with:

- `Models` to define how the `resources` look.
- `Controllers` to access the `resources`.
- `Routes`:
	- To let the `controllers` know how to run.
	- To expose our `API`.

### MVC with a Service Oriented Twist

Instead of grouping our code by type (all `controllers` to the `controllers` folder, all `models` to the `models` folder, ...), we are going to group our code by `feature` (including `tests`).

#### Organization Example

- api/
	- todos/
		- `todoController.js`
		- `todoController.specs.js`
		- `todoModel.js`
		- `todoModel.specs.js`
		- `todoRoutes.js`
		- `todoRoutes.specs.js`
- config/
- utils/
- `index.js`
- `package.json`

### Configuration

#### `process.env.NODE_ENV`

Use `process.env.NODE_ENV` to tell our application in which environment is running in:

- `development`
- `production`
- `testing`

Those 3 are the most common ones, but you can add the ones you want at will.

As a convention, use `development` as the default.

#### Other `env` vars

- Set and reference other `env` vars, aside from `process.env.NODE_ENV`.
- Create a central location for the `config` files.
- Depending on the `process.env.NODE_ENV` value, we can require different `config` files and merge them so our app can use it.

#### `config.js` example

`config/config.js`

```node
// Base config object
const config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',

  port: process.env.PORT || 3000,
  env: '',

  secrets: {
    githubToken: process.env.GITHUB_TOKEN,
    jwtSecret: process.env.JWT_SECRET
  }
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

// Load up development.js || testing.js || production.js
let envConfig = {};
try {
  envConfig = require(`./${config.env}`);
} catch (e) {
  envConfig = {};
}

// Merge the two objects (using ES2015 Object.assign).
const configToExport = Object.assign({}, config, envConfig);

// Export the resulting object so our App can use it.
module.exports = configToExport;
```

The `secrets` are not hardcoded (`jwtSecret: process.env.JWT_SECRET`) so the `config.js` file can go into source control.

### Planinng a new `API`

Think about:

1. What `resources` we would need.
2. The `routes` for that `resources`.
3. Don't immediately start modelling the `resources`.


### Relative vs Absolute paths

- Relative paths for `imports`.
- Absolute paths for anything related to file system.


## 6. MongoDB

- `Mongo` is a `NoSQL` Document Store.
- `Mongo` does not care about the *form* of our data:
	- Don't have to model the data.
	- Can just throw `json` in it and ask for it later.

### Intro to `Mongo`

#### 1. Run `mongod`

```console
✔ mongod --config /usr/local/etc/mongod.conf
```

#### 2. Open the `mongo` repl

```console
✔ mongo
```

#### 3. Play with it

```console
✔ mongo
MongoDB shell version: 3.2.3
connecting to: test

> show dbs
flicks   0.078GB
grocery  0.078GB
local    0.078GB

> use puppies
switched to db puppies

> db.createCollection('toys')
{ "ok" : 1 }

> show collections
system.indexes
toys

> db.toys.insert({ name: 'yoyo', color: 'red' })
WriteResult({ "nInserted" : 1 })

> db.toys.find()
{ "_id" : ObjectId("56d85e335b44363b1a940cef"), "name" : "yoyo", "color" : "red" }
```

### `Mongoose`

#### Install `mongoose`

```console
✔ npm install --save mongoose
```

#### Connect to a `mongo` instance

```node
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/nameOfTheDBYouWant');
```

### Schemas

- We can use `schemas` in `mongoose` to add some structure and validations to our data.
- `Mongo` **does not** need `schemas`.

#### Basic `schema` example

```node
import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  completed: Boolean,

  // Add validations by using an object literal
  content: {
    type: String,
    required: true
  }
});

// Add a 'todos' Collection using our TodoSchema
const TodoModel = mongoose.model('Todo', TodoSchema);

export default TodoModel;
```

#### Real-world `schema` example

```node
const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  whenAdopted: Date,

  hasShots: Boolean,

  collarCode: Buffer,

  age: {
    type: Number,
    min: 0,
    max: 30
  },

  toys: [],

  location: {
    state: String,
    city: String,
    zip: Number
  },

  // Relationship example: "A dog belongs to an owner".
  owner: {
    // the owner's id
    type: mongoose.Schema.Types.ObjectId,
    // there's an owner schema, somewhere
    ref: 'owner',
    required: true
  }
});
```

#### `Schema`s, `Model`s, `Document`s and `Collection`s

- `Schema`: The *blueprint* for the data (how I want my data to look like).
- `Model`:
	- The `javascript` representation of the data we are going to use.
	- Allow us to access the `document` in the `database`.
- `Document`: The data representation inside the `database` (belongs to the `Collection`).
- `Collection`: A group of `document`s inside the `database`.

The `model` and the `document` are the same thing, but the `model` lives in our `javascript` code while the `document` lives in `mongo`.

#### Normalized vs Denormalized data

- **Normalized data**:
	- Only one way to access a concrete piece of data.
	- *Example*: Posts know about authors, but authors don't know about posts.
- **Denormalized data**:
	- More than one way to access a concrete piece of data.
	- *Example*: Posts know about authors, and authors know about posts.

### Queries

`Mongo` has a sophisticated query syntax that is full of options.

#### (`Mongoose`) `.find()`

```node
import Post from './postModel';

postRouter.route('/')
  .get((req, res, next) => {
    Post.find(
      { title: 'My awesome blog post' },
      (err, docs) => err ? next(err) : res.json(docs)
    );
  });
```

#### (`Mongoose`) `.findById()`

- Helpful for `GET`, `PUT` and `DELETE`, since an `:id` is needed.

```node
import Post from './postModel';

postRouter.route('/')
  .get((req, res, next) => {
    Post.findById(
      '56d85e335b44363b1a940cef',
      (err, doc) => err ? next(err) : res.json(doc)
    );
  });
```

#### (`Mongoose`) `.findByIdAndUpdate()`

- **GOTCHA**: It will blow away the properties of the document than are not handled to it. So, you need to handle the updated properties and also the non-updated properties.

```node
import Post from './postModel';

postRouter.route('/')
  .put((req, res, next) => {
    Post.findByIdAndUpdate(
      '56d85e335b44363b1a940cef',
      // SAY BYE BYE to the other properties aside from title
      { title: 'My updated title' },
      (err, updatedDoc) => err ? next(err) : res.json(updatedDoc)
    );
  });
```

#### (`Mongoose`) `.save()` #1

```node
import Post from './postModel';

postRouter.route('/')
  .post((req, res, next) => {
    const post = new Post({
      title: 'My awesome blog post',
      ....
    });

    post.save(
      (err, savedDoc) => err ? next(err) : res.json(savedDoc)
    );
  });
```

#### (`Mongoose`) `.save()` #2

```node
import Post from './postModel';

postRouter.route('/')
  .post((req, res, next) => {
    const post = new Post();
    post.title: 'My awesome blog post';
    ....

    post.save(
      (err, savedDoc) => err ? next(err) : res.json(savedDoc)
    );
  });
```

#### (`Mongoose`) `.create()`

```node
import Post from './postModel';

postRouter.route('/')
  .post((req, res, next) => {
    const post = {
      title: 'My awesome blog post',
      ....
    };

    Post.create(
      post,
      (err, savedDoc) => err ? next(err) : res.json(savedDoc)
    );
  });
```

#### (`Mongoose`) `.remove()`

```node
import Post from './postModel';

postRouter.route('/')
  .delete((req, res, next) => {
    ....

    doc.remove(
      (err, removedDoc) => err ? next(err) : res.json(removedDoc)
    );
});
```

### `Population`s

- Since `Mongo` is a `NoSQL` Database, there's no join tables.
- `Population`s are:
	- a join-table-like-at-call-time solution.
	- a way to hydrate `model`'s relationships at call time.

```node
// THE SCHEMAS
const DogSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'person'
  },
  name: String
});

const PersonSchema = new mongoose.Schema({
  name: String
});

// THE MODELS
const Dog    = mongoose.model('dog', DogSchema);
const Person = mongoose.model('person', PersonSchema);

// THE POPULATION:
//   - find all dogs         `.find({})`
//   - populate their owners `.populate('owner')`
//   - do it!                `.exec()`
// This will actually:
//   - grab the owners object
const getAllDogs = (req, res, next) => {
  Dog
    .find({})
    .populate('owner')
    .exec()
    .then(
      (dogs) => res.json(dogs),
      (err)  => next(err)
    );
};
```

### `mongoose` and `promise`s

- Does `mongoose` `promise` library follow the `A+` `promise`s specification?
- Wo we need to `Promisify` `mongoose` with `BlueBird`?

#### Wire your own `promise` library to `mongoose`

**NOTE**: Taken from [Built-in Promises](http://mongoosejs.com/docs/promises.html).

You can plug in your own `Promise`s Library since `Mongoose` 4.1.0

Just set `mongoose.Promise` to your favorite ES6-style `promise` constructor and `mongoose` will use it.

```node
const query = Band.findOne({name: "Guns N' Roses"});

// Use ES2015 native promises
mongoose.Promise = global.Promise;
assert.equal(query.exec().constructor, global.Promise);

// Use bluebird
mongoose.Promise = require('bluebird');
assert.equal(query.exec().constructor, require('bluebird'));

// Use q. Note that you **must** use `require('q').Promise`.
mongoose.Promise = require('q').Promise;
assert.ok(query.exec() instanceof require('q').makePromise);
```

### The road to `promise`s

#### Callbacks

```node
const action = (cb) => {
  setTimeout(() => cb('hey'), 2000);
};

action(
  (arg) => console.log(arg)
);
```

#### `Promise`s

A Promise is just an Object with a couple of functions.

```node
const action = () =>
  new Promise(
    (resolve, reject) => setTimeout(() => resolve('hey'), 2000)
  );


action()
  .then((word) => console.log(word))
  .catch((err) => console.log(err));
```

#### `Promise`s and async file actions

```node
import fs from 'fs';

const readFile = () =>
  new Promise((resolve, reject) =>
    fs.readFile(
      './package.json',
      (err, file) => err ? reject(err) : resolve(file.toString())
    )
  );

readFile()
  .then((file) => console.log(file))
  .catch((err) => console.log(err));
```

#### Chaining `Promise`s

Whatever you `return`ed inside the `then()` callback, is then wrapped into another promise (monad?).

A typical *chaining* pattern:

```node
readFile()
  .then(logFile)
  .then(sendEmail)
  .then(callCustomer)
  .catch(handleErrors);
```

#### Parallel `Promise`s

```node
const readAllFiles = () => {
  const promises = [promise1, promise2, promise3];
  return Promise.all(promises);
};

readAllFiles()
  .then((files) => files.map(f => console.log(f)))
  .catch((err) => console.log(err));
```

#### Alternatives to `Promise`s

- Generators
- Fibers
- Async/Await


## 7. Authentication using JSON Web Tokens (`JWT`)

### Intro to `JWT`

- `JWT` is a heavily used open standard.
- Because we're using a `token` approach, we don't need to keep track of who is signed in with a `session store` or have `cookies`.
- `Cookies` don't work very well in mobile environments (it's not as easy as on the Web).
- The `JWT` will be sent on every `request` (`REST` is stateless).
- The `JWT` has to be stored on the client that is requesting resources (usually in the `local storage`).
- `JWT`s can be used with `OAuth`, too.

### Using `JWT`

```node
const user = {_id: '2873273237328378273'};

// Generate a JWT based on user's id
const token = jwt.sign(user, 'shhhh, its a secret');

// Send the JWT back to the client on signup/signin

//...

// Later on we have an incoming request, so:
//   - we decode the JWT to see who the user is.
//   - the JWT is probably on the authorization header.
//   - throw an error if the JWT is not a valid JWT and instead is a random string.
const user = jwt.verify(req.headers.authorization, 'shhhh, its a secret');

// If it's a valid JWT, we could then proceed to look the user up to see if she exists in our system
User.findById(user._id, () => {});
```

- `jwt.sign()` as little as you need (enough to identify who is making the `request`).
- Don't `jwt.sign()` an entire `user` if it's not strictly necessary.

### The `JWT` dance

1. A user signs up to access protected resources on our api, (`username` and `password`).
2. On success, we create a new user in our database.
3. We use the new user's id to issue a `JWT`.
4. We send that `JWT` back to the user on the signup's response, so she can:
	5. save it
	6. send it back on every request to a protected resource.
7. We get authentication
8. We also get identification, because we can reverse the `JWT` to be its original object and get the user's id.

### Passwords

- **DO NOT** store plain text passwords in your database, store a `hash`ed and `salt`ed version.
- **DO NOT** send plain text passwords over `HTTP`, use `HTTPS` (use `HTTPS` for your whole site, if you can).
- To further prevent *rainbow attacks* create unique `salt`s for each user and store the `salt` on the user.
- `salt` and `hash` asynchronoulsy to avoid *time attacks*.

### Authentication with `mongoose` `middleware`

There are so many ways to implement *passwords* with `express` and `mongo`.

We are going to use `mongoose` middleware for that task.

#### `methods` and `statics` on `mongoose`'s `Schema`s

```node
// METHODS
//   - almost like 'prototype'.
//   - available to this concrete instance:
//     * not other instances
//     * not the Dog itself
DogSchema.methods.bark = () => {
  // this === the dog document
};

// STATICS
//   - almost like static methods.
//   - available to the Dog itself:
//     * not instances of Dog
DogSchema.statics.findByOwner = () => {
  // this === the Dog Constructor
};
```

#### `mongoose` `middleware` example

`mongoose` `middleware` will attach themselves to life cycle events around `document`s

```node
// `.post('save')` ===> After `save`
DogSchema.post('save', (next) => { .... });

// `.pre('validate')` ===> Before `validate`
DogSchema.pre('validate', (next) => { .... });
```


## 8. Securing routes

### What resources do we want to protect?

- In non very private resources, at least `POST`, `PUT` and `DELETE` should be protected.
- In very private resources, protect everything.

### Commom pattern with JWT and Users

`api/users/me` route:

- Very common with JWT.
- Used for a user that has the JWT.

### Understanding `CORS`

#### `CORS` Scenario

Browsers, by default, are not going to grant access to a route in `localhost:3000` if we are on `localhost:4500`.

```
XMLHttpRequest cannot load http://localhost:3000/api/posts.
No 'Access-Control-Allow-Origin' header is present on the requested resource.
Origin 'http://localhost:4500' is therefore not allowed access.
```

To avoid this behaviour:

- Enable CORS in your server (share resources across different origins).

#### When to enable `CORS`

An API that other people is going to consume, should be `CORS` enable.

#### Where to deal with `CORS`

If you have a proxy like `Ngnix` you should deal with `CORS` there.

#### The Pre-flight check

A browser asks the server (using the `OPTIONS` http verb), am I allowed to request from you?

- the server responds with a 2xx allowing requests (then `CORS` is enabled).
- the server responds with a denying requests (then `CORS` is disabled)

### Three ways to remove a property from a document

A great way to eensure that we don't see a hashed password in your data.

#### On a document making a method

Delete `password` from `user`:

```javascript
UserSchema.methods = {
  ....
  toJson () {
    const obj = this.toObject;
    delete obj.password;
    return obj;
  }
};
```

#### On a `population`

Get only `username` from `author`:

```javascript
Post
  .findById(postId)
  .populate('author', 'username')
  .exec()
```

#### On a record query using `.select()`

Do not get `password` from `user`:

```javascript
User
  .findById(userId)
  .select('-password')
```

### `JWT` vs API Keys

- `JWT`s are for the users (authentication).
- API keys are for authorizing clients (iOS, android, web, ...) to use an API.

You could probably use a `JWT` as an API Key.

## 9. Deployment

### Things to consider when deploying

- Use `envs` for secrets (don't check them into `github`)
- Don't hardcode dev urls, db urls, ports, etc
- Make sure you are using error handling
- Make sure all your dependencies are being installed
- If you're going to have your platform build for you, make sure it has access to all your build tools (`grunt`, `gulp`, `webpack`)
- You can freeze `node modules` by using `npm shrinkwrap`

### procfile

```
web: node index.js
```

Run it like `heroku` will run it:

```console
foreman start
```


## 10. Final Notes

- You should probably save also the slug on the DB (on the Model)


## 11. TODOs

### Investigate `PATCH` vs `PUT`

**NOTE TO SELF**: Check my notes of [RESTful Rails Development](http://shop.oreilly.com/product/0636920034469.do) book about this.

### Investigate `Redis`

Investigate how to use `Redis` if you want to use *sessions* when authenticating

### Investigate `window.fetch` vs `window.XMLHttpRequest`

### Investigate how to sanitize `schemas` before saving
