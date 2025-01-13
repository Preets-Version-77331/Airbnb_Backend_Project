# Airbnb Backend Project

This project is a backend implementation for an Airbnb-like application. It includes features for user authentication, home listings, and file uploads.

## Features

- User Authentication (Login, Signup, Password Reset)
- Home Listings (Add, Edit, Delete, View)
- File Uploads (Images for homes)
- Favorites functionality for users
- Session management with MongoDB

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS (Embedded JavaScript templates)
- Multer (for file uploads)
- SendGrid (for sending emails)
- Helmet (for security)
- Compression (for performance)
- Morgan (for logging)

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB instance (local or cloud)
- SendGrid account for email services

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/Airbnb_Backend_Project.git
    cd Airbnb_Backend_Project
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create environment configuration files:
    ```bash
    cp .env.example .env.development
    cp .env.example .env.production
    ```

4. Fill in the environment variables in `.env.development` and `.env.production`:
    ```plaintext
    MONGO_DB_USERNAME=your_mongodb_username
    MONGO_DB_PASSWORD=your_mongodb_password
    MONGO_DB_DATABASE=your_database_name
    SENDGRID_API_KEY=your_sendgrid_api_key
    SENDER_EMAIL=your_sender_email
    ```

5. Ensure the `uploads` directory exists:
    ```bash
    mkdir uploads
    ```

### Running the Application

1. Start the server:
    ```bash
    npm start
    ```

2. The server will run at `http://localhost:3000`.

## Usage

- Access the application at `http://localhost:3000`.
- Use the signup page to create a new account.
- Login with your credentials.
- Add, edit, or delete home listings as a host.
- View and add homes to favorites as a guest.

## Project Structure

- `app.js`: Main application file.
- `models/`: Contains Mongoose models.
- `controllers/`: Contains route handlers.
- `routers/`: Contains route definitions.
- `views/`: Contains EJS templates.
- `public/`: Contains static files.
- `uploads/`: Directory for uploaded files.
- `.env.example`: Example environment configuration file.
- `.gitignore`: Specifies files to be ignored by Git.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License.