Of course. Here is a detailed description of the folder feature based on the code you provided.

The folder feature in this application provides a way to organize and manage documents and subfolders. It allows for the creation, retrieval, and filtering of folders, as well as managing access to them through invitations. Each folder is associated with a creator and can be created for another user. The feature also includes functionality for archiving folders and logging all folder-related activities for auditing purposes.

### Key Features:

- **Folder Creation**: Users can create new folders by providing a `name` and optionally specifying a `created_for` user ID. The `created_by` field is automatically populated with the ID of the logged-in user.
- **Folder Retrieval**: The feature supports retrieving folders in several ways:
    - **By ID**: Fetches a single folder by its ID, including details about the creator, the user it was created for, its documents, and its subfolders.
    - **All Folders**: Retrieves a list of all folders in the system, along with the details of their creators and the users they were created for.
    - **By User**: Returns a paginated list of folders created by the logged-in user.
- **Folder Filtering**: Folders can be filtered based on various criteria, including `name`, `created_by`, `created_for`, `archived` status, and a date range. The filtering is case-insensitive for the folder name.
- **Folder Archiving**: Folders can be marked as archived, which is useful for hiding them from the main view without permanently deleting them.
- **Access Control**: The feature includes a system for managing access to folders through invitations. Users can be invited to access a folder, and the system tracks the status of these invitations (e.g., "Accepted," "Pending").
- **Audit Logging**: All significant actions related to folders, such as creation, retrieval, and archiving, are logged for auditing purposes. This includes the user who performed the action, their IP address, and a description of the action.

### Data Relationships:

- A **Folder** can have one **creator** (a User) and can be created for one **createdFor** (another User).
- A **Folder** can contain multiple **documents** and **subfolders**.
- A **Folder** can have multiple **access invitations** associated with it, each linked to a user by their email address.