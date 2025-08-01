## Backend Development Plan

### 1. Dashboard Enhancements
- Implement backend logic to incorporate deal distribution by amount for dashboard charts.

### 2. Deals Module Refinements
- Modify deal model/validation to make consultant name optional.
- Ensure financial figures are stored/processed in a way that supports display in millions.
- Develop backend logic for teaser generation and linking to deals, following data room completion.
- Implement robust file upload and management APIs for documents, including linking to teasers and other relevant entities.
- Develop backend services for folder structure hierarchy and file management within the data room.
- Implement backend logic for automatic folder name generation.

### 3. Benchmarking Site & Investment Overview
- Implement backend data models and APIs to support a 3-5 line summary with investment criteria.
- Extend data models to include investment type, minimum ticket size, and investor capital partner information.
- Develop backend relationships and APIs for managing multiple contact persons per investor and enabling teaser sharing with selected employees.
- Implement backend logic for dynamic employee expertise assignment and relevant targeting.
- Ensure backend system reflects employee movement between companies.
- Update data models to support investors having 5 or more company deals.
- Ensure flexibility in backend to add more employees.

### 4. Target Companies Module
- Update backend data model to include gross margin.
- Modify backend model/validation to make valuation field optional; include total assets and total revenue instead.
- Implement backend logic to use LTM (Last 12 Months) revenue for financial calculations.
- Rename backend fields: "Cash Runway" to "Total Assets", "Risk Analysis" to "PSG or Impact Story", and "Leadership" to "Team".
- Add backend data model support for competition brief.
- Implement backend logic for archiving companies.

### 5. Milestones Module
- Refine backend relationships to tie milestones to target companies and investors.
- Implement backend data models and logic to link each deal to multiple investors (up to 20) with independent tracking.
- Develop backend logic to put deals on hold based on investor metrics.
- Implement backend functionality to capture and associate the lead person managing a transaction from a specific fund.
- Implement backend logic for clients to reject transactions.

### 6. Audit Trail
- Ensure backend logging captures all system activities, including permission and access rights.
- Implement backend filtering logic for audit trail data.
- Explore backend integration with Airtable-like functionality for external data gathering.

### 7. Integrations & Deployment
- Configure backend for Azure account integration and specific user accounts.
- Continue AI updates and integrate MS Graph AI on the backend.
- Prepare backend resources and configurations for platform deployment to facilitate external testing.

## Frontend Development Plan

### 1. Dashboard Enhancements
- Implement a universal filter component on the UI that affects all charts and tables on the dashboard.
- Incorporate deal type filtering into the dashboard UI.
- Add a filter button to the UI that applies filters to all charts and tables.

### 2. Deals Module Refinements
- Implement UI formatting to display financial figures in millions.
- Refine the deal selection process UI based on pending clarifications.
- Develop UI components for users to upload documents when interacting with teasers or other documents.
- Implement UI for displaying folder listings with multiple display formats and filtering options.
- Add UI option for autopicking folder names.

### 3. Benchmarking Site & Investment Overview
- Design and implement UI components to display a brief 3-5 line summary with investment criteria.
- Display investment type, minimum ticket size, and investor capital partner information on the UI.
- Develop UI for managing contact persons per investor and selecting employees for teaser sharing.
- Implement UI for dynamic employee expertise assignment.
- Introduce a "Team" section in the UI after the "Overview" section, listing all contacts.

### 4. Target Companies Module
- Display gross margin details on the company overview UI.
- Adjust UI form fields to make valuation optional and include total assets and total revenue.
- Update UI labels: "Cash Runway" to "Total Assets", "Risk Analysis" to "PSG or Impact Story", and "Leadership" to "Team".
- Display competition brief on the UI.
- Implement UI for archiving companies.

### 5. Milestones Module
- Develop UI to display milestones tied to target companies and investors.
- Implement UI for tracking deals linked to multiple investors independently.
- Add UI functionality to put deals on hold based on investor metrics.
- Display the lead person managing a transaction from a specific fund on the UI.
- Implement UI option for clients to reject transactions.

### 6. Audit Trail
- Design and implement UI for displaying system activities, including permission and access rights.
- Develop UI filtering capabilities for audit trail data.
- Explore UI integration for an Airtable-like form on the main website as a banner for external data gathering.

### 7. Design & Integrations
- Finalize color palette choices and update the entire UI accordingly.
- Collaborate with Alvin for Office 365/Azure configuration related to frontend integrations.
