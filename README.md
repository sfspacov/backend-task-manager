
# Simple Task Manager

This is a simple task manager application built with Node.js, Express, and TypeScript. It includes CORS for handling cross-origin requests, Swagger for API documentation, an in-memory cache for performance enhancement, and JWT tokens for authorization.

## **🌟 Frontend project that fits perfectly with this backend: [https://github.com/sfspacov/front-task-manager](https://github.com/sfspacov/front-task-manager) 🌟**

## Prerequisites

- A running PostgreSQL instance is required for the database.
- Node.js and npm must be installed on your machine.

## Setup Instructions

1. **Create a `.env` File**

   You need to create a `.env` file in the root of the project or update your existing one with your database and SMTP credentials. Additionally, update the `JWT_SECRET` for secure token generation.

   ```plaintext
   PORT=2000
   DB_USER='postgres'
   DB_HOST='localhost'
   DB_DATABASE='task_manager'
   DB_PASSWORD='sa'
   DB_PORT='5432'
   JWT_SECRET='fD$887_+{§}_patr15'
   EMAIL_USER='myemail@email.com'
   EMAIL_PASSWORD='strongPassword'
   ```

2. **Database Setup**

   Open your PostgreSQL instance and execute each step of the script located at: [https://github.com/sfspacov/backend-task-manager/blob/main/src/db/scripts/generate-db.sql](src/db/scripts/generate-db.sql).

3. **Install Dependencies**

   Open a terminal in the root of the project and run the following command to install the necessary dependencies:

   ```bash
   npm install
   ```

4. **Start the Application**

   To start the application, run:

   ```bash
   npm start
   ```

   The application will start on the port specified in your `.env` file (default: 2000).

5. **Testing**

   To execute the tests, run:

   ```bash
   npm test
   ```

## Features

- **Node.js & Express**: The project is built using Node.js and Express framework.
- **TypeScript**: Written in TypeScript for type safety and modern JavaScript features.
- **CORS**: Configured to allow cross-origin requests.
- **Swagger**: API documentation available at [http://localhost:2000/swagger/](http://localhost:2000/swagger/).
- **In-Memory Cache**: Utilized for performance improvements.
- **JWT Tokens**: Used for secure authorization and session management.

## Development

For local development, you can run the application using:

```bash
npm run dev
```

This will start the application with nodemon, allowing automatic restarts upon code changes.

## Contributing

Feel free to fork this repository, submit issues, and make pull requests. Any contributions are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please reach out to [sfsapcov@gmail.com](mailto:myemail@email.com).
