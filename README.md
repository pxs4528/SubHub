# SubHub - Subscription Manager

<img src="frontend/src/assets/Untitledpic.svg"/>

## Table of Contents

- [Project Overview](#project-overview)
- [Specifications and Design](#specifications-and-design)
- [Makefile Instructions](#makefile-instructions)
- [Code and Tests](#code-and-tests)
- [Two Factor Authentication](#two-factor-authentication)
- [Performance](#performance)
- [Security Measures](#security-measures)
- [Dashboard](#dashboard)
- [PDF Parser](#pdf-parser)
- [Future Iteration Plan](#future-iteration-plan)
- [Customers and Users](#customers-and-users)

## Project Overview

SubHub is a comprehensive subscription management application designed to help users efficiently manage their subscriptions. It provides a user-oriented, versatile solution for organizing subscription services.

## Specifications and Design

Our specification and design document covers key features, data structures, and input/output details. Each subscription entry includes vital information like service name, cost, billing cycle, renewal date, and payment method.

## Makefile Instructions

To streamline project management, we have included a Makefile that simplifies common tasks. Please use the following Makefile instructions:

- **Frontend**: Install frontend dependencies.
  ```shell
  make frontend
  ```
- **Dev Frontend Server**: Run the development server for the frontend.
  ```shell
  make dev-frontend
  ```
- **Backend**: Manage backend Go modules.
  ```shell
  make backend
  ```
- **Run backend server**: Start the backend server.
  ```shell
  make run-backend
  ```
- **Run Both Frontend and Backend**
  ```shell
  make run
  ```

## Code and Tests

- **Creating User Table**
- **Creating Two Factor Authentication Table**
- **Postman test for login for 10 minutes**

### Two Factor Authentication

- **Description**: Users creating accounts manually will use a two-factor authentication system.
- **Implementation**: A six-digit code is sent to the user's email during login/signup, with an automatic database deletion after 3 minutes.

### Performance

- **Description**: Improve system performance.
- **Implementation**: Utilize goroutines for concurrency in Golang to speed up various processes.

### Security Measures

- **Authentication and Authorization**: Secure user sessions using HTTP-only cookies, JWT tokens, and strong password hashing.
- **Data Encryption**: Protect sensitive data with HTTPS encryption.
- **Data Validation**: Sanitize and validate user inputs to prevent vulnerabilities.

## Dashboard

The dashboard provides a central hub for subscription management, including:

- **Subscription Overview**: A summary of active subscriptions.
- **Subscription Management**: Add, remove, or edit subscription details.
- **Data Visualization**: Graphical representations of spending and more.
- **User Preferences**: Customizable settings.

## PDF Parser

- **Client-Side**: Handles file upload and transfer to the backend.
- **Parsing**: PDFs are parsed based on keywords, and data is sent back as JSON.
- **Future Plan**: Integrate the PDF Parser with the frontend and backend.

## Future Iteration Plan

### Iteration 3

- Complete Home Page
- Complete PDF Parser
- Dashboard and diagrams

## Customers and Users

We have been surveying students at UTA for feedback on SubHub
