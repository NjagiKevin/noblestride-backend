# Noblestride

Noblestride is a Node.js application that provides APIs for user management and deal management. The project uses Express.js for routing, Sequelize for ORM, and JWT for authentication.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/noblestride.git
    cd noblestride
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the environment variables in a `.env` file:
    ```env
    secretKey=ydwygyegyegcveyvcyegc
    ```

4. Start the server:
    ```sh
    npm start
    ```

## Usage

The server will start on the port specified in the `.env` file or default to port 8080. You can access the APIs using a tool like Postman or via your frontend application.

**Important:** Database migrations are now managed manually. Please run `npm run migrate` to apply any pending database schema changes.

## API Endpoints

### User Routes

- **POST** `/api/users/signup` - Register a new user
- **POST** `/api/users/login` - Login a user
- **GET** `/api/users/profile` - Get the profile of the logged-in user

### Deal Routes

- **POST** `/api/deals` - Create a new deal
- **GET** `/api/deals` - Get all deals
- **GET** `/api/deals/:id` - Get a deal by ID
- **PUT** `/api/deals/:id` - Update a deal by ID
- **DELETE** `/api/deals/:id` - Delete a deal by ID

### Document Routes

- **POST** `/api/documents` - Create a new document
- **GET** `/api/documents` - Get all documents
- **GET** `/api/documents/:id` - Get a document by ID
- **PUT** `/api/documents/:id` - Update a document by ID
- **DELETE** `/api/documents/:id` - Delete a document by ID

### Transaction Routes

- **POST** `/api/transactions` - Create a new transaction
- **GET** `/api/transactions` - Get all transactions
- **GET** `/api/transactions/:id` - Get a transaction by ID
- **PUT** `/api/transactions/:id` - Update a transaction by ID
- **DELETE** `/api/transactions/:id` - Delete a transaction by ID

### Audit Log Routes

- **POST** `/api/audit-logs` - Create a new audit log entry
- **GET** `/api/audit-logs` - Get all audit logs
- **GET** `/api/audit-logs/:id` - Get an audit log by ID

## Environment Variables

The following environment variables are used in the project:

- `secretKey`: The secret key used for JWT authentication.

## Office 365 Email Integration

This application includes a new module for integrating with Office 365 email capabilities (sending, viewing inbox, saving drafts) using the Microsoft Graph API.

### Setup

1.  **Azure AD App Registration:**
    You *must* register an application in Azure Active Directory to use this functionality.
    *   Go to the Azure portal: `portal.azure.com`
    *   Navigate to "Azure Active Directory" -> "App registrations".
    *   Click "New registration".
    *   Give it a name (e.g., "Noblestride Office 365 Integration").
    *   For "Supported account types", choose "Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)".
    *   For "Redirect URI", select "Web" and enter `http://localhost:3030/api/office365/auth/callback`.
    *   After registration, go to "Authentication" and ensure "Implicit grant and hybrid flows" -> "Access tokens" and "ID tokens" are checked (though for this specific flow, only access tokens are strictly needed, it's good practice).
    *   Go to "Certificates & secrets" and create a new client secret. **Copy the value immediately** as it will not be shown again.
    *   Go to "API permissions" and add the following Microsoft Graph permissions:
        *   `Mail.ReadWrite` (Delegated)
        *   `Mail.Send` (Delegated)
        *   `User.Read` (Delegated - usually default, but confirm)
        *   `offline_access` (Delegated - for refresh tokens)
    *   Grant admin consent for these permissions.

2.  **Environment Variables:**
    Add the following to your `.env` file (or `.env.development.local`):
    ```env
    O365_CLIENT_ID=YOUR_AZURE_AD_APPLICATION_CLIENT_ID
    O365_CLIENT_SECRET=YOUR_AZURE_AD_CLIENT_SECRET_VALUE
    O365_TENANT_ID=YOUR_AZURE_AD_TENANT_ID
    O365_REDIRECT_URI=http://localhost:3030/api/office365/auth/callback
    ```
    Replace the placeholder values with the actual ones from your Azure AD app registration.

3.  **Restart the Application:**
    After setting the environment variables, restart the Node.js application for changes to take effect.

### Obtaining `YOUR_OFFICE365_ACCESS_TOKEN`

The `YOUR_OFFICE365_ACCESS_TOKEN` is obtained via the OAuth 2.0 flow with Microsoft. You initiate this by navigating to `http://localhost:3030/api/office365/auth/initiate` in your browser, which redirects you to Microsoft's login page. After logging in and granting permissions, Microsoft redirects back to `http://localhost:3030/api/office365/auth/callback`. Your application's `handleAuthCallback` function processes the authorization code from this redirect, exchanging it for an access token. This `accessToken` is returned in the JSON response from the callback URL. Copy this `accessToken` value and paste it into your `http-client.env.json` file. Remember, access tokens are short-lived; in production, refresh tokens are used for programmatic renewal, requiring secure, persistent storage.

## Database Seeding

To seed the database with initial data, you can use the following commands:

### Run All Seeders

```sh
npm run seed:all
```

### Run a Specific Seeder

```sh
npm run seed -- --seed <seeder-file-name>
```

**Example:**

```sh
npx sequelize-cli db:seed --seed 20250109080956-seed-permissions.js
```

### Undo Seeding

To undo the last seeder or all seeders:

- **Undo the most recent seeder:**
    ```sh
    npm run seed:undo
    ```
- **Undo all seeders:**
    ```sh
    npm run seed:undo:all
    ```

## Database Migrations

To run database migrations, use the following command:

```sh
npm run migrate
```

## Project Structure
