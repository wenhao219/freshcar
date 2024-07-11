# API README

This is the API repository for application.

## Default Accounts

Upon system startup, the following default accounts are created:

- **Admin Account**
  - Username: admin
  - Password: 123456

- **User Account**
  - Username: user
  - Password: 123456

## Technology Stack

This API is developed using **Express.js**.

## Structure and Potential Improvements

The current structure of the application could be enhanced by:

- **Separation of Concerns**: Consider separating routes, controllers, middleware, and services to improve code organization and maintainability.
- **Role-Based Permissions**: Implement role-based access control (RBAC) to restrict access to certain API endpoints based on user roles.
- **Booking Validation**: Add an API endpoint to verify if a car has already been booked by another user before initiating a new booking.

## Getting Started

To get started with the API, follow these steps:

1. **Create an Uploads Folder**: Before running the application, create an "uploads" folder in the root directory for uploading images.

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev