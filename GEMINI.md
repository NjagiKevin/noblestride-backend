## Project Name

Noblestride

## Project Description

Noblestride is a Node.js application that serves as a matchmaking platform for investors. It provides APIs for managing users, deals, documents, transactions, and more. The application uses Express.js for routing, Sequelize as an ORM for PostgreSQL, and JWT for authentication.

## Technologies

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JSON Web Tokens (JWT)
- **API Documentation:** Swagger
- **Testing:** Jest, Supertest
- **Other Dependencies:**
    - `@azure/identity`
    - `@microsoft/microsoft-graph-client`
    - `@sendgrid/mail`
    - `@vercel/postgres`
    - `axios`
    - `bcrypt`
    - `cookie-parser`
    - `cors`
    - `csv-parser`
    - `docusign-esign`
    - `dotenv`
    - `express-fileupload`
    - `moment`
    - `multer`
    - `node-cron`
    - `nodemailer`
    - `pg`
    - `pg-hstore`
    - `winston`

## Commands

- **Start the application:** `npm start`
- **Run tests:** `npm test`

## API Endpoints

The following are the base paths for the API endpoints:

- `/api/audit-logs`
- `/api/commission`
- `/api/contact-person`
- `/api/continent-preference`
- `/api/continents`
- `/api/country-preference`
- `/api/countries`
- `/api/dashboard`
- `/api/deal-access-invite`
- `/api/deal-continent`
- `/api/deal-country`
- `/api/deal-milestone`
- `/api/deal-milestone-status`
- `/api/deal-region`
- `/api/deals`
- `/api/deal-stage`
- `/api/deal-type-preference`
- `/api/documents`
- `/api/document-share`
- `/api/document-type`
- `/api/docusign-webhook`
- `/api/email`
- `/api/folder-access-invite`
- `/api/folders`
- `/api/investor-deal-stages`
- `/api/investor-milestone`
- `/api/investor-milestone-status`
- `/api/investors-deals`
- `/api/milestones`
- `/api/notifications`
- `/api/permissions`
- `/api/pipelines`
- `/api/pipeline-stages`
- `/api/primary-location-preference`
- `/api/region-preference`
- `/api/regions`
- `/api/roles`
- `/api/sector-preference`
- `/api/sectors`
- `/api/settings`
- `/api/social-account-type`
- `/api/social-media-account`
- `/api/stage-card`
- `/api/subfolder-access-invite`
- `/api/subfolders`
- `/api/sub-sector-preference`
- `/api/subsectors`
- `/api/tasks`
- `/api/teams`
- `/api/transactions`
- `/api/user-preferences`
- `/api/user-review`
- `/api/users`
- `/api/user-ticket-preference`

## Testing

The project uses Jest for testing. Test files are located in the `__tests__` directory. To run the tests, use the `npm test` command.