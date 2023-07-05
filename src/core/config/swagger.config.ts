import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwaggerDoc(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('My Project')
    .setDescription(
      `This API is a NestJS application that provides services for note management and user authentication. It allows users to perform CRUD (Create, Read, Update, Delete) operations on notes and authenticate and authorize themselves within the application.

This API offers the following key services:

- Authentication: Enables users to register and authenticate themselves using valid credentials.
- Notes: Allows users to manage their notes, including creating, retrieving, updating, and deleting notes. Additionally, notes can be archived, changing their state from active to archived.
- Note Archiving: The API provides functionality for archiving and unarchiving notes, allowing users to organize their notes based on their state.

Authentication Process:

To access protected resources and perform authorized actions, authentication is required. This API uses JSON Web Tokens (JWT) for authentication. The authentication process involves the following steps:

    Registration: Users need to create an account by providing their relevant information, such as username, email, and password. This can be done through the /register endpoint, which accepts a POST request with the user's details.

    Login: Once registered, users can log in to obtain an authentication token. The login process is initiated by sending a POST request to the /login endpoint, providing the username/email and password. If the credentials are valid, an authentication token is generated and returned in the response.

    Token Usage: To access protected resources, clients must include the obtained JWT in the Authorization header of subsequent requests. The header should be formatted as follows: Authorization: Bearer <token>. The token represents the user's identity and permissions.

    To authorize endpoints in this Swagger UI documentation, locate the "Authorize" button next to this text.
    Click on the "Authorize" button to open the authorization modal.
    In the modal, enter the access token obtained during the login process in the "Value" field.
    Click on the "Authorize" button in the modal to apply the access token.
    The modal will close, and the access token will be included in the authorization header of each request made through Swagger UI.
    You can now interact with the authorized endpoints and make requests by using the Swagger UI interface.`,
    )
    .setVersion('1.0')
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });
}
