# eSupština

# **Backend Documentation**

## **Overview**

This documentation provides detailed insights into the backend structure and functionalities of the MERN (MongoDB, Express.js, React.js, Node.js) stack application deployed on Azure.

## Application Setup

1. Clone project
2. Install packanges with 
3. Populate `.env` folder
    
    ```
    HTTP_PORT = 
    TOKEN_SECRET = 
    USER = 
    SERVICE = 
    BASE_URL = 
    OAUTH_CLIENTID = 
    OAUTH_CLIENT_SECRET = 
    OAUTH_REFRESH_TOKEN = 
    OAUTH_ACCESS_TOKEN = 
    MONGO_URI = 
    AZURE_STORAGE_ACCOUNT_STORAGE_STRING = 
    ```
    
4. Start application with `npm run start:dev`

## **Application Structure**

The backend of the application is organized into five main parts:

1. **Authentication**: Manages user authentication and authorization.
2. **Agenda**: Handles agenda-related operations and data management.
3. **Session**: Manages session-related functionalities.
4. **Socket**: Supports real-time communication features.
5. **Vote**: Manages voting-related functionalities.

Each part consists of its own model, API routes, and controller functions to facilitate efficient retrieval and manipulation of data from the database.

## **Route Functionality**

### **APIs and Controllers**

- **Index.js**: Located inside the **`apis`** folder, it defines all the routes for the application.
- **API Functions**: Defined in files within the **`api`** folder, these functions are called upon endpoint requests. They primarily focus on data destructuring received from the frontend and invoking corresponding controller functions for database operations.

### **Authentication Functionality**

- The authentication functionality includes:
    - SignUp
    - SignIn
    - JWT Token Provisioning

### **User Roles**

- Users can have three different roles:
    - Client
    - Admin
    - Super-admin
- Admin permissions include accessing the protected **`/admin`** route to manipulate agendas and sessions. Super-admins have extended access, including user information manipulation on route `/super-admin`.

## **Models and CRUD Operations**

- **Agenda and Session Models**: Each model includes CRUD (Create, Read, Update, Delete) operation functions.
- **Session-Agenda Relationship**: Sessions and agendas are connected through IDs. Each session contains a property named **`agendas`**, representing a list of agenda IDs belonging to that session.
- **Agenda-Specific Logic**:
    - When retrieving all sessions, additional logic ensures that the **`agendas`** property provides entire agenda objects related to the IDs.
        - Additional logic for getting all sessions with agendas provide whole agenda object inside session property `agendas` instead just list of agenda ids
    - Deleting an agenda removes its ID from the session object.
    - Deleting a session removes all agendas belonging to that session.

## **Conclusion**

This documentation outlines the backend architecture, route functionality, authentication processes, user roles, and models with CRUD operations for the MERN stack application. It serves as a comprehensive guide for developers and administrators working with the backend of the application.

## Application Setup

1. Clone project
2. Install packanges with 
3. Start application with `npm start`
4. If you want to start with local backend you need to change url inside `axios` file

# **Frontend Documentation**

## **Overview**

This documentation provides a user-friendly guide to navigating and utilizing the frontend of the application, built with React and styled using Material UI. The frontend facilitates seamless interaction with the application's features and functionalities.

## **Routes**

The frontend consists of four main routes:

- **`/`**: Login page for user authentication.
- **`/main`**: Main page displaying sessions, agendas, and voting results.
- **`/tv`**: Live preview of current agenda voting, designed for spectator viewing.
- **/admin**: Admin panel for CRUD operations on agendas and sessions.
- **`/super-admin`**: Super-admin panel for CRUD operations on user data.

## **Main Page**

The main page is divided into three main parts:

1. **Left Part**:
    - Top section: Burger menu for session selection, user name display, and admin/super-admin access buttons.
    - Bottom section: List of agendas. Clicking on an agenda selects it. Agendas marked as "locked" indicate that voting has concluded.
2. **Middle Part**:
    - Representation of the agenda document as a PDF.
3. **Right Part**:
    - Voting preview:
        - Users are categorized by parties.
        - Each user's vote status is indicated with colors and explained alongside the agenda.

## **TV Page**

The TV page provides a live preview of the ongoing voting agenda:

- Similar to the main page, users are divided by parties.
- Visitors can view the voting status of each user in real-time.
- Visitors on top of page can see results

## **Admin Panel**

The admin panel allows authorized users to perform CRUD operations on agendas and sessions:

- Create, read, update, and delete operations are supported.
- Deleting a session removes all associated agendas.
- Possibility to upload pdf.

## **Super-admin Panel**

The super-admin panel offers similar functionalities as the admin panel but focuses on user data manipulation:

- CRUD operations on user data, including creation, modification, and deletion.

## **Conclusion**

This documentation serves as a user-friendly guide for navigating and utilizing the frontend of the application. It provides clear instructions on accessing different routes, understanding the main page layout, utilizing the TV page for live voting previews, and efficiently managing agendas, sessions, and user data through the admin and super-admin panels.

# Frontend Technical Logic

## Router file

The router file manages the routing functionality of the application, directing users to different pages based on their authentication status and role. Here's an overview of how the router works:

### **Functionality Overview:**

- The router utilizes the **`BrowserRouter`** component from React Router for declarative routing.
- It defines routes for different pages of the application using the **`Route`** component.
- Based on the user's authentication status and role, the router redirects them to appropriate pages or displays a login page if necessary.

### **Code Breakdown:**

- **Authentication Check**:
    - The **`isLoggedIn`** variable, obtained from the **`useAuth`** hook, checks if the user is logged in.
    - The **`role`** variable retrieves the user's role from the local storage.
- **Route Definitions**:
    - The router defines routes for the login page, main page, TV screen, admin panel, and super-admin panel.
    - Conditional rendering is used to ensure that users are redirected to the appropriate pages based on their authentication status and role.
- **Conditional Rendering**:
    - If the user is not logged in (**`!isLoggedIn`**), they are redirected to the login page (**`<LoginScene />`**).
    - If the user is logged in, they are redirected to the main page (**`<MainScene />`**) unless they access the root URL, in which case they are redirected to the main page.
    - Access to the admin panel (**`<Admin />`**) and super-admin panel (**`<SuperAdmin />`**) is restricted based on the user's role. Only users with the "admin" or "super-admin" role can access these pages.
- **Navigation**:
    - The **`<Navigate>`** component from React Router is used to programmatically navigate users to different pages.

## Main screen

The **`MainScene`** component serves as the main interface for the voting application. It allows users to view agendas, participate in votes, and view voting statistics in real-time. This component interacts with backend services through websockets to fetch agenda data, handle voting events, and update voting results dynamically.

### **Dependencies**

- React
- react-router-dom
- @material-tailwind/react
- react-toastify
- lodash

### **Props**

The **`MainScene`** component does not accept any props.

### **State**

- **`party`**: Array of party names.
- **`users`**: Array of user data grouped by party.
- **`open`**: Boolean flag indicating whether the vote dialog is open.
- **`adminOpen`**: Boolean flag indicating whether the admin dialog is open.
- **`abstrainedNum`**: Number of abstained votes.
- **`yesNum`**: Number of 'yes' votes.
- **`noNum`**: Number of 'no' votes.
- **`notVotedNum`**: Number of users who haven't voted.
- **`selectedAgenda`**: Currently selected agenda item.
- **`startedVote`**: Data about the started vote.
- **`isFullScreen`**: Boolean flag indicating whether the interface is in full-screen mode.
- **`isReset`**: Boolean flag indicating whether a vote reset has been requested.
- **`updateFlag`**: Boolean flag indicating whether to update vote statistics.
- **`userName`**: Name of the current user.
- **`selectedAgendaPdf`**: ID of the currently selected agenda PDF.
- **`votingAgenda`**: Data about the agenda currently being voted on.
- **`connected`**: Boolean flag indicating whether the user is connected to the server.
- **`showLogout`**: Boolean flag indicating whether to show the logout menu.
- **`voteClose`**: Boolean flag indicating whether voting is closed.
- **`showModal`**: Boolean flag indicating whether to show the agenda modal.
- **`admin`**: Boolean flag indicating whether the user is an admin.
- **`superAdmin`**: Boolean flag indicating whether the user is a super admin.
- **`newAgenda`**: Boolean flag indicating whether a new agenda has been added.
- **`preAgenda`**: Array of pre-agenda items.
- **`dailyAgenda`**: Array of daily agenda items.
- **`selectedIndexAgenda`**: Index of the currently selected agenda.
- **`getUpdate`**: Boolean flag indicating whether to fetch agenda updates.
- **`sessions`**: Array of session data.
- **`currentSession`**: Data about the currently active session.
- **`formData`**: Form data for creating a new agenda item.

### **Socket Events**

- **`live_voting_results`**: Event triggered when live voting results are received.
- **`vote_start`**: Event triggered when a vote is started.
- **`vote_update`**: Event triggered when a vote is updated.
- **`vote_close`**: Event triggered when a vote is closed.
- **`vote_reset`**: Event triggered when a vote is reset.

### **Functions**

- **`changeVoteView(param)`**: Handles changing the vote view based on user input.
- **`sendVoteStart()`**: Initiates the start of a vote.
- **`sendVoteClose()`**: Initiates the closure of a vote.
- **`sendVoteReset()`**: Initiates the reset of a vote.
- **`checkAgendaState()`**: Checks the state of the currently selected agenda.
- **`getDecisionFromAgenda(userId, voteInfo)`**: Gets the decision of a user from the agenda vote info.
- **`handleLogout()`**: Handles user logout.
- **`toggleLogout()`**: Toggles the logout menu.
- **`cancelAgenda()`**: Cancels the creation of a new agenda.
- **`sessionChange(item)`**: Handles the change of active session.
- **`setCookie(name, value, minutesToExpire)`**: Sets a cookie with the specified name, value, and expiration time.
- **`getCookie(name)`**: Gets the value of a cookie by name.

### **Structure**

The **`MainScene`** component consists of three main sections:

1. **Agenda Navigation**: Allows users to navigate through pre-agenda and daily agenda items.
2. **Agenda Viewer**: Displays the selected agenda PDF along with controls for toggling full-screen mode.
3. **Voting Interface**: Provides voting controls, live voting statistics, and user voting status.

### **Interaction**

- Users can navigate between agenda items by selecting from the list of pre-agenda and daily agenda items.
- Admin users can start, close, and reset votes for agenda items.
- Voting controls allow users to vote 'yes', 'no', or abstain from voting.
- Live voting statistics are updated in real-time based on user interactions and server updates.

### **Related Components**

- **`VoteAlert`**: Component for displaying alerts related to voting.
- **`CloseAlert`**: Component for displaying alerts related to closing votes.
- **`CustomButton`**: Custom button component for agenda navigation.
- **`UserComponent`**: Component for displaying user voting status.
- **`AgendaDialog`**: Dialog component for creating new agenda items.
- **`PdfViewer`**: Component for displaying PDF documents.

## TV screen

The TV screen component is responsible for displaying a live preview of the ongoing voting agenda. Here's an overview of how the code works:

### **Functionality Overview:**

- The component fetches user data and agenda information using Axios services.
- It utilizes WebSocket communication (using the **`socket`** utility) to receive real-time updates on voting status and agenda changes.
- Users are grouped by parties, and their voting decisions are displayed alongside their names.
- The component dynamically updates as new votes are cast or when the agenda changes.

### **Code Breakdown:**

- **State Management**:
    - The component manages various states using the **`useState`** hook to track party data, user data, voting statistics, agenda ID, agenda details, and modal visibility.
- **WebSocket Events**:
    - The component listens for WebSocket events such as "live_voting_results", "vote_start", "vote_update", "vote_close", and "vote_reset" to handle real-time updates on voting status and agenda changes.
- **Effect Hooks**:
    - **`useEffect`** hooks are used to fetch user data, agenda information, and update voting statistics based on the received data.
- **Rendering**:
    - The component renders the agenda name, voting statistics, and user list grouped by parties.
    - Each user's voting decision is displayed alongside their name.
    - Voting statistics such as the total number of votes, votes in favor, votes against, and abstentions are displayed.
    - Users are categorized into parties, and their names and voting decisions are displayed within their respective party containers.

## Admin screen

The Admin panel allows authorized users with the "admin" or "super-admin" role to perform CRUD operations on sessions and agendas. It provides a user-friendly interface for managing these entities efficiently. Here's a breakdown of its functionality:

### **Components Used:**

- **AdminNavigation**: A component providing navigation links within the admin panel.

### **Features:**

1. **Viewing Sessions and Agendas**:
    - Users can view a list of sessions along with their associated agendas.
    - Sessions are displayed in reverse chronological order, allowing users to easily identify recent sessions.
    - Each session displays its name, and associated agendas are listed beneath it.
2. **Adding a New Session**:
    - Users can add a new session by clicking the "DODAJ NOVU SEDNICU" button.
    - A dialog box prompts the user to enter details such as the session title, start time, and end time.
    - After filling in the required information, users can save the new session.
3. **Updating a Session**:
    - Users can edit an existing session by clicking the edit icon next to the session they wish to modify.
    - The session details are pre-filled in a dialog box, allowing users to make necessary changes.
    - After updating the session details, users can save their changes.
4. **Deleting a Session**:
    - Users can delete a session by clicking the delete icon next to the session they wish to remove.
    - A confirmation dialog ensures that the user intends to delete the session before proceeding.
5. **Adding a New Agenda**:
    - Users can add a new agenda by clicking the "DODAJ NOVU AGENDU" button.
    - A dialog box prompts the user to enter details such as the agenda title, description, PDF file, and associated session.
    - After providing the required information, users can save the new agenda.
6. **Updating an Agenda**:
    - Users can edit an existing agenda by clicking the edit icon next to the agenda they wish to modify.
    - The agenda details are pre-filled in a dialog box, allowing users to make necessary changes.
    - After updating the agenda details, users can save their changes.
7. **Deleting an Agenda**:
    - Users can delete an agenda by clicking the delete icon next to the agenda they wish to remove.
    - A confirmation dialog ensures that the user intends to delete the agenda before proceeding.

### **Functionality:**

- The panel fetches session data upon component mount and displays it for the user to interact with.
- CRUD operations are performed using API calls to the backend services.
- Toast notifications provide feedback to the user regarding the success or failure of their actions.

## Super Admin Screen

The Super Admin panel provides elevated privileges compared to the regular Admin panel. Super Admins have access to additional features for managing users within the application. Here's an overview of its functionality:

### **Components Used:**

- **AdminNavigation**: Similar to the Admin panel, providing navigation links within the Super Admin panel.
- **UserDialog**: A dialog component used for adding or updating user information.

### **Features:**

1. **Viewing Users**:
    - Super Admins can view a list of users registered within the application.
    - User details such as name, email, and party affiliation are displayed.
2. **Adding a New User**:
    - Super Admins can add a new user by clicking the "DODAJ NOVOG USERA" button.
    - A dialog box prompts the Super Admin to enter details such as the user's name, email, password, party affiliation, role, and city.
    - After providing the required information, Super Admins can save the new user.
3. **Updating a User**:
    - Super Admins can edit an existing user's details by clicking the edit icon next to the user they wish to modify.
    - The user details are pre-filled in a dialog box, allowing Super Admins to make necessary changes.
    - After updating the user details, Super Admins can save their changes.
4. **Deleting a User**:
    - Super Admins can delete a user by clicking the delete icon next to the user they wish to remove.
    - A confirmation dialog ensures that the Super Admin intends to delete the user before proceeding.

### **Functionality:**

- The panel fetches user data upon component mount and displays it for the Super Admin to interact with.
- CRUD operations are performed using API calls to the backend services.
- Toast notifications provide feedback to the Super Admin regarding the success or failure of their actions.