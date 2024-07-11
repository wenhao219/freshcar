# Frontend README

This is the frontend repository for application, built with Next.js.

## Default Accounts

Upon system startup, the following default accounts are created:

- **Admin Account**
  - Username: admin
  - Password: 123456

- **User Account**
  - Username: user
  - Password: 123456

## Technology Stack

This frontend application is developed using **Next.js**.

## Potential Improvements

To enhance the application, consider focusing on the following areas:

- **UI/UX Design**: Improve the attractiveness and user-friendliness of the user interface to provide a more intuitive experience for users.
- **User Authentication**: Enhance the login and authentication process to ensure security and usability.
- **Feature Expansion**: Consider adding new features such as real-time updates, notifications, or integrations with external services.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

1. **Login**: After running the application, you will be directed to the login page. You need to login to proceed further:
- If logged in as **admin**, you can access the admin page to manage the car inventory through basic CRUD operations.
- If logged in as a **user**, you can view the list of available cars, select a car to rent, and complete the booking by providing necessary details. Users can also manage their bookings, view booking details, or cancel bookings.