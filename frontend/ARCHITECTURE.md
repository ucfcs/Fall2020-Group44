# Pages

There are 5 main Pages in the application, several modals, and one page that is used for authentication.

## Authentication

The `LogIn` component located at `src/components/log-in/log-in.tsx` manages the authentication credentials that are received from the backend. Canvas and the backend authenticate with each other and then the backend redirects canvas to `<base url>/course/<courseId>?token=<JWT>`

The `LogIn` component captures the course ID and the JWT and saves them to the application state, then redirects to the base URL.

## Main Pages

The main pages are:

1. Home
2. Gradebook
3. GradebookSession
4. Present
5. SessionInProgress

### Home

#### Route

`<base url>/`

#### File

`src/components/home-page/home.tsx`

#### About

The `Home` page is where the user begins. It is the question management screen and is where users go to create, edit, delete, and present questions. The user is able to navigate to the `Gradebook` page from here, as well as activate the present, create/edit question, and create folder modals.

### Gradebook

#### Route

`<base url>/gradebook`

#### File

`src/components/gradebook/gradebook.tsx`

#### About

The `Gradebook` page is where the user views the grades of students from past sessions. The user is able to navigate to the `Home` and `GradebookSession` pages from here, as well as activate the export grades modal.

### GradebookSession

#### Route

`<base url>/gradebook/:sessionId`

#### File

`src/components/session/session.tsx`

#### About

The `GradebookSession` page is where the user views the grades of students from a specific session. This view shows the grades on a per question basis instead of a per session basis like the main gradebook. The user is able to navigate to the `Home` and `Gradebook` pages from here, as well as activate the export grades modal.

### Present

#### Route

`<base url>/session/present`

#### File

`src/components/present-session/present-session.tsx`

#### About

The `Present` page is where the user goes to after selecting questions to present in the present modal. This relies on a session being started in the present modal, and is where the user will wait while students join their session. There is a count of how many students are connected to the session. Once the user is ready to start displaying questions, they navigate to the `SessionInProgress` screen. Users are also able to navigate back to the home screen from here.

### SessionInProgress

#### Route

`<base url>/session/display`

#### File

`src/components/session-in-progress/session-in-progress.tsx`

#### About

The `PresentSession` page is used to run a session by the user. It can be used to open and close questions to responses, view the current question, view student responses, and view the correct answer. Users can navigate to the `Home` screen from this page. There is a warning modal if the user navigates away prior to closing all the questions.

## Modals

The modals are:

1. Creator
2. FolderModal
3. QuestionSelect
4. ExportModal
5. WarningModal

### Creator

#### Activated By

- Home

#### File

`src/components/creator-modal/creator.tsx`

#### About

This modal is used on the home page to create and edit questions. If it is in the create state it will start blank and allow the user to fill it in. Then it will send the API call to create a new question. If it is in the edit state it will be prefilled with the information from the quesiton being edited. The user can change it as they wish and it will send the API call to edit the selected question.

### FolderModal

#### Activated By

- Home

#### File

`src/components/folder-modal/folder-modal.tsx`

#### About

This modal is used on the home page to create new folders. The user fills in a folder name and a new folder is then created.

### QuestionSelect

#### Activated By

- Home

#### File

`src/components/question-select-modal/question-select-modal.tsx`

#### About

This modal is used to select questions to present in a session. The user selects one or more questions and is directed to the `Present` page after a new session is started.

### ExportModal

#### Activated By

- Gradebook
- GradebookSession

#### File

`src/components/export-modal/export-modal.tsx`

#### About

This modal is used to export grades to Canvas. It can be activated by either the main gradebook or a session's gradebook. If it is done from within a session's grades, that session will be preselected for exported. The user can then select one or more sessions to export, choose the name and points of the assignment, then export to Canvas. After it is complete the modal closes.

### Warning Modal

#### Activated By

- SessionInProgress

#### File

`src/components/warning-modal/warning-modal.tsx`

#### About

This modal warns professors if they are closing a session early. This could mean that one or more questions have not been answered by students. Currently it is based off of how many questions are locked. If they are all locked, no warning will be given and the full grade will be calculated. If they are not all locked this modal will be activated. If the user continues to close the session then the grade will be based off of only the locked questions.

# File Structure

An atomic file structure is used to create self contained components.

## src/

- `App.tsx` - Sets up WebSocket connection and handles routing.
- `index.tsx` - Sets up the React App with the state provider.
- `index.scss` - Global styles for all the components.
- `store.js` - Handles the global state store.
- `types.ts` - Stores type declarations that are shared across components.

## src/components/

Each top level folder in this section represents either a specific page, modal, or a component that is shared across more than one top level components. Each folder can have more folders inside if the top level component is broken up into several different files that are only used for that one specific component.
