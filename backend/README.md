# Backend

## Dependencies

- [Sequelize](https://sequelize.org/master/manual/getting-started.html)
- [Serverless](https://www.serverless.com/framework/docs/getting-started/)
  - [Dotenv](https://www.serverless.com/plugins/serverless-dotenv-plugin)
  - [Webpack](https://www.serverless.com/plugins/serverless-webpack/)
  - [Offline](https://www.serverless.com/plugins/serverless-offline/)
- [Node Fetch](https://www.npmjs.com/package/node-fetch)

## Development

### Initialize Database

To create database tables and their relationship.

```
npm run db:build
```

### Local Server

#### Environment Variable

Create two files, one called `.env.development` and another called `.env.production`.
`.env.development` is used wwheen you are running the project locally. and `.env.production` is used when you are deploying the backend to AWS.
Below is the template for the ENV files.

```bash
# use thesse values for accessing the local MySQL & Reddis containers
NODE_ENV=development

MYSQL_HOST=localhost
MYSQL_DATABASE=ucfpoll
MYSQL_USER=root
MYSQL_ROOT_PASSWORD=root

CANVAS_URL=http://example.com
CANVAS_ID=101
CANVAS_KEY=shhhh
CANVAS_REDIRECT=http://somewhere.else
```

### Initialize Docker

Now you will need to spin of the MySQL and Reddis docker containers, you do that using the following command.

```
docker-compose -f "docker-compose.yml" up -d --build
```

#### Install Dependencies

```
npm i
```

#### Run Local Serverless

Now you can

For the use case of working on the Canvas LTI you will need a local instance of the backend running. Luckily servereless provides this using Serverless-Offline. Run the following command to start the local lambda server.

```
npm run dev
```

### Invoking

In the case you want to invoke a single function, for the case of initalizing the DB tables.
Then you can run the following command. `hello` is the name of your function.

```
npx serverless invoke local --function hello
```

## Deployment

```
npm run deploy
```

## Resouces

- [TS with Serverless](https://lesscodeismore.dev/serverless-typescript/)
