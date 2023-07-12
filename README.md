<h1 align="center">My Notes API</h1>

![NODE](https://img.shields.io/badge/NODE-18.13.0-8FC965?labelColor=5D9741&style=for-the-badge) ![NESTJS](https://img.shields.io/badge/NESTJS-9.4.2-389AD5?labelColor=31C4F3&style=for-the-badge) ![Docker Compose](https://img.shields.io/badge/Docker--compose-2.13.0-8FC965?labelColor=5D9741&style=for-the-badge) ![PG](https://img.shields.io/badge/Postgresql-15-389AD5?labelColor=31C4F3&style=for-the-badge) ![SWAGGER](https://img.shields.io/badge/SWAGGER-^6.3.0-8FC965?labelColor=5D9741&style=for-the-badge)

## Description

This API is a NestJS application that provides services for note management and user authentication. It allows users to perform CRUD (Create, Read, Update, Delete) operations on notes and authenticate and authorize themselves within the application.

This API offers the following key services:

- Authentication: Enables users to register and authenticate themselves using valid credentials.
- Notes: Allows users to manage their notes, including creating, retrieving, updating, and deleting notes. Additionally, notes can be archived, changing their state from active to archived.
- Note Archiving: The API provides functionality for archiving and unarchiving notes, allowing users to organize their notes based on their state.

The API utilizes a PostgreSQL database running in a Docker container. Environment variables are required to configure the database connection.

## Testing the Deployed API

You can test the deployed API by visiting the following URL:

[API Documentation](https://notes-api-with-auth.up.railway.app/docs)

The documentation provides detailed information on the available endpoints and how to interact with the API. Feel free to explore and test the functionality of the API.


## Initial configuration for local use
Before run the project, you must provide the following environment variables, it can be done using a .env file at project root directory:

```bash
NODE_ENV=<development|production>
PORT=<Port_where_you_want_the_api_to_run>

#Database
DB_NAME=<Database_name_you_want_to_use>
DB_USER=<Database_username_you_want_to_use>
DB_PASSWORD=<Database_password>
DB_HOST=<Database_host>
DB_PORT=<Database_port>

#Jwt
ACCESS_TOKEN_SECRET=<Custom_secret>
ACCESS_TOKEN_EXPIRATION=<Seconds_you_want_the_access_token_to_last>
REFRESH_TOKEN_SECRET=<Custom_secret>
REFRESH_TOKEN_EXPIRATION=<Seconds_you_want_the_refresh_token_to_last>
```

## Build & run database
You'll need to have docker and docker-compose installed.
At project root directory, run:
```bash
docker-compose up -d
```

## Run migrations
With your database running, run:
```bash
npm run migration:run
```

## How to run

```bash
npm i
npm run build
npm run start
```

## Authentication

The API uses JWT (JSON Web Tokens) for request authentication. Protected endpoints require including the JWT token in the Authorization header of the request.

### Obtaining JWT Token

To obtain a valid JWT token, you need to send an authentication request with user credentials to the following endpoint:

```POST /api/v1/auth/login```


The request should include the username and password in the request body. If the credentials are valid, you will receive a JWT token in the response.

### Including JWT Token in Requests

Once you have obtained a valid JWT token, you should include it in the Authorization header of protected requests. Make sure to use the "Bearer" prefix followed by the JWT token. Here's an example of how the authorization header should be included:

```Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...```

Remember that the JWT token has an expiration date and needs to be renewed periodically to keep the session active. If the token expires, you will need to request a new one through the login process.

## For more information on the available endpoints and how to interact with the API, please refer to the automatically generated documentation at the /docs route once the application is running or visit the 'API Documentation' link above in 'Testing the Deployed API' section.
