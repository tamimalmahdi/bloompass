# Typo-Tolerant Password Authentication System

by Tamim Almahdi ta00687

This project implements a web-based application with a typo-tolerant password authentication system. The system aims to address common typographical and user errors encountered during login, improving usability without compromising authentication security.

## Features

Typo-tolerant password authentication: The system incorporates a typo correction scheme to accommodate fat-fingering errors and other common typos made during password entry.
Space-efficient storage: The application utilizes a bloom filter to store typo variants of passwords in a many-to-one relationship, ensuring efficient storage and retrieval of authentication information.
Password encryption: Passwords are encrypted using the SHA256 algorithm, providing a secure layer of protection for sensitive user data.

## Setup and Installation

_note that the application may require a "npm insatall" in the respective directories to install node module packages_

Clone the repository: git clone <repository_url>
Install dependencies: npm install
Configure the database connection in the config.js file.
Start the application: npm start
Usage
Access the application through the provided URL.
Register a new account with a username and password.
Log in with your credentials, accounting for typo errors in the password.
Explore the different functionalities and features of the application.

## Contributing

Contributions are welcome! If you have any suggestions, bug fixes, or additional features to propose, please open an issue or submit a pull request.
