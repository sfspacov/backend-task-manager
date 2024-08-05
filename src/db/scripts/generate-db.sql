-- Step 1: Create a new database
CREATE DATABASE task_manager;

-- Step 2: SELECT THIS DATABASE!!

-- Step 3: Create the Users table
CREATE TABLE Users (
    email VARCHAR(255) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

-- Step 4: Create the Tasks table
CREATE TABLE Tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL,
    user_email VARCHAR(255),
    FOREIGN KEY (user_email) REFERENCES Users(email) ON DELETE CASCADE
);
-- Check the data
SELECT * FROM Users;
SELECT * FROM Tasks;
