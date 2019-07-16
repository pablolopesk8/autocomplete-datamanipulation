# autocomplete-datamanipulation

Auto complete and Data Manipulation service to resolve the Challenge for hiring process on Dito

## Overview

This repository contains an API service, a Database service and a Frontend service.  
Those services, integrated, provide ways to POST events, GET events and GET timeline.

## Language and Libraries

[NodeJS](http://nodejs.org), was chosen as language to develop the API.  
Some libraries was used with NodeJS:

1. [Express](https://expressjs.com/pt-br/) - used to manage and to configure the routes of API
2. [BodyParser](https://www.npmjs.com/package/body-parser) - used because of the necessity to parsing the requests
3. [Request Pomisse Native](https://github.com/request/request-promise-native) - used to enable the use of promisses natively, with async / await
4. [Dotenv](https://www.npmjs.com/package/dotenv) - used to store enviroment variables
5. [Cors](https://github.com/expressjs/cors) - used to avoid errors when accessing the API in a localhost browser

[ReactJS](https://pt-br.reactjs.org/) was chosen as language to build the frontend interface.  
One library was used with ReactJS:

1. [AutoSuggest](https://github.com/moroshko/react-autosuggest) - used to create an auto complete component.

### Linter

Used [ESLint](https://eslint.org/) with the basic NodeJS configuration. The linter is configurated only in *development* enviroment.

### Enviroment Variables

To store common variables that will be use in some parts of code, was used [Dotenv](https://www.npmjs.com/package/dotenv).  
There is one *.env* example file on repository. You need to create a *.env* file and put your own values here. Remember, your *.env* file will not be commited to the repository.

### Validator

To get validation of data, was used [AJV](https://github.com/epoberezkin/ajv).

## Database

[MongoDB](https://www.mongodb.com/) was used as storage. The reasons for this choice are, mainly, the speed and the simplicity of the data.  
For connect and execute operations in database, was used [Mongoose](https://mongoosejs.com/).  
MongoDB was configured with auth to provide more security.

## Server

In development mode, was used [Nodemon](https://nodemon.io/).

## Microservices

[Docker](https://docker.com) was chosen to create to services for this application:

1. NodeJS Server: a simple server, with the minimum configuration, running node and exposing the port 3005
2. MongoDB Server: a server with minimum configuration, running MondoDB and exposing the port 3006
3. Frontend Server: a simple server, using NodeJS, NPM and Webpackage and exposing the port 3007

## Endpoints

In the API there are 3 endpoints:

1. GET a list of events, filtering by name
2. POST a new event
3. GET a timeline, with a list of events

For more details about the API, use the file (docs/dito_autocomplete.postman_collection.json) with Postman.

## Running

To running this project, the best way is up the docker, because it will up NodeJS, MongoDB and Frontend services. And all are integrated. For this, use

```bash
docker-compose up -d
```

If you want to run only the NodeJS service, you can run (inside /api folder)

```bash
npm run start:dev
```

If you want to run only the Frontend service, you can run (inside /front folder)

```bash
npm start
```

> If you run only NodeJS service, you need start manually the container of database. And your connection with mongo, configured on [env file](#enviroment-variables), must be done using *localhost:exposed_port*.

## Tests

For the tests was used [Mocha](https://mochajs.org/) as library to execute and to describe the tests. For the assertion and validation was used [ShouldJS](https://shouldjs.github.io/). For faker returns and throws of server, was used [Sinon](https://sinonjs.org/). And for HTTP tests was used [Supertest](https://www.npmjs.com/package/supertest).  
To run the tests, run (inside /api folder)

```bash
npm test
```

> My suggestion is to run the tests outside a container. For this, you need to update the [env file](#enviroment-variables) changing the *MONGODB_HOST* and *MONGODB_PORT* to your localhost configuration, like *localhost* and *3006*

## IDE

The [VSCode](https://code.visualstudio.com/) was chosen as the IDE to develop this API. Was created config about that IDE and the file is [docs/vscode.config.json] with configurations about Debug using mocha, that can be used for anybody.
