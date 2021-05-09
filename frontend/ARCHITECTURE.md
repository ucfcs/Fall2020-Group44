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

# Global State Management

## Data

### `previewFolder`

#### Type

Number

#### Usage

Number representing the index of the folder in the questions array. For editing and previewing folder info.

### `previewQuestion`

#### Type

Number

#### Usage

Number representing the index of the question in the questions array. For editing and previewing question info.

### `creatorFolderIndex`

#### Type

Number

#### Usage

Number used when creating or editing a question to pre select the folder the question will be associated with.

### `sessionInProgress`

#### Type

Boolean

#### Usage

True when there is an active session running with unanswered questions. False when it is over and all questions are answered.

### `sessionId`

#### Type

Number

#### Usage

The ID of the currently running session. Used for making API calls.

### `openExitWarning`

#### Type

Boolean

#### Usage

Controls the exit warning modal. Displays the modal when true and hides it when false.

### `courseId`

#### Type

String

#### Usage

The ID of the course that the user is authenticated with. Used for API calls.

### `questions`

#### Type

Array

#### Structure

A 2D array. Each array is a folder containing questions.

```
[[<question 1>, <question 2>], [<question 3>, <question 4>]]
```

#### Usage

Used for displaying questions on the home page and question management throughout the app.

### `sessionQuestions`

#### Type

Array

#### Structure

A 2D array. Each array is a folder containing questions.

```
[[<question 1>, <question 2>], [<question 3>, <question 4>]]
```

#### Usage

Similar to the `questions` array, but it is only the questions being used in an active session.

### `editPreviewQuestion`

#### Type

Boolean

#### Usage

True if the creator modal is being used to edit an existing question instead of creating a new question.

### `openCreator`

#### Type

Boolean

#### Usage

True if the creator modal is to be open, false if not.

### `openFolderCreator`

#### Type

Boolean

#### Usage

True if the folder creator modal is to be open, false if not.

### `openQuestionSelect`

#### Type

Boolean

#### Usage

True if the modal used to select questions to present is to be open, false if not.

### `questionNumber`

#### Type

Number

#### Usage

The index of the question that is currently active in a session. Used in the `sessionQuestions` array.

### `classSize`

#### Type

Number

#### Usage

The number of students currently in a session.

### `openExportModal`

#### Type

Boolean

#### Usage

True if the modal used to export questions to Canvas is to be open, false if not.

### `currentQuestionInfo`

#### Type

Object

#### Structure

A 2D array. Each array is a folder containing questions.

```javascript
{
  title: "<question title>",
  question: "<question text>",
  type: "Mult Choice",
  QuestionOptions: [
    { key?: "<uuid>", text: "<answer text>", isAnswer: boolean }
  ],
  folderId: null | number,
  participationPoints: number,
  correctnessPoints: number
}
```

#### Usage

The question info used for editing and creating a question, primarily in the creator modal.

### `websocket`

#### Type

WebSocket Connection

#### Usage

The WebSocket connection that is maintained when the user is logged in.

### `jwt`

#### Type

String

#### Usage

The JavaScript Web Token used when the user is authenticated with Canvas. Sent with all API calls.

## Actions

### `update-preview-folder`

#### Associated State Variable

`previewFolder`

#### Payload

Number

#### Usage

Changes the number of the `previewFolder` variable.

### `update-preview-question`

#### Associated State Variable

`previewQuestion`

#### Payload

Number

#### Usage

Changes the number of the `previewQuestion` variable.

### `update-creator-module-folder-index`

#### Associated State Variable

`creatorFolderIndex`

#### Payload

Number

#### Usage

Changes the number of the `creatorFolderIndex` variable.

### `enable-exit-warning`

#### Associated State Variable

`sessionInProgress`

#### Payload

None

#### Usage

Sets the `sessionInProgress` variable to true.

### `update-session-id`

#### Associated State Variable

`sessionId`

#### Payload

Number

#### Usage

Changes the number of the `sessionId` variable.

### `disable-exit-warning`

#### Associated State Variable

`sessionInProgress`

#### Payload

None

#### Usage

Sets the `sessionInProgress` variable to false.

### `show-exit-warning-modal`

#### Associated State Variable

`openExitWarning`

#### Payload

None

#### Usage

Sets the `openExitWarning` variable to true.

### `hide-exit-warning-modal`

#### Associated State Variable

`openExitWarning`

#### Payload

None

#### Usage

Sets the `openExitWarning` variable to false.

### `edit-preview-question`

#### Associated State Variable

`editPreviewQuestion`

#### Payload

None

#### Usage

Sets the `editPreviewQuestion` variable to true.

### `close-preview-question`

#### Associated State Variable

`editPreviewQuestion`

#### Payload

None

#### Usage

Sets the `editPreviewQuestion` variable to false.

### `update-session-questions`

#### Associated State Variable

`sessionQuestions`

#### Payload

Array of questions.

#### Usage

Sets the `sessionQuestions` array.

### `open-creator`

#### Associated State Variable

`openCreator`

#### Payload

None

#### Usage

Sets the `openCreator` variable to true.

### `close-creator`

#### Associated State Variable

`openCreator`

#### Payload

None

#### Usage

Sets the `openCreator` variable to false.

### `open-folder`

#### Associated State Variable

`openFolderCreator`

#### Payload

None

#### Usage

Sets the `openFolderCreator` variable to true.

### `close-folder`

#### Associated State Variable

`openFolderCreator`

#### Payload

None

#### Usage

Sets the `openFolderCreator` variable to false.

### `open-question-select`

#### Associated State Variable

`openQuestionSelect`

#### Payload

None

#### Usage

Sets the `openQuestionSelect` variable to true.

### `close-question-select`

#### Associated State Variable

`openQuestionSelect`

#### Payload

None

#### Usage

Sets the `openQuestionSelect` variable to false.

### `update-question-number`

#### Associated State Variable

`questionNumber`

#### Payload

Number

#### Usage

Changes number of the `questionNumber` variable.

### `update-class-size`

#### Associated State Variable

`classSize`

#### Payload

Number

#### Usage

Changes number of the `classSize` variable.

### `open-export-modal`

#### Associated State Variable

`openExportModal`

#### Payload

None

#### Usage

Sets the `openExportModal` variable to true.

### `close-export-modal`

#### Associated State Variable

`openExportModal`

#### Payload

None

#### Usage

Sets the `openExportModal` variable to false.

### `reset-current-question-info`

#### Associated State Variable

`currentQuestionInfo`

#### Payload

None

#### Usage

Sets the `currentQuestionInfo` variable to the value of the `baseQuestionInfo` in `store.js`.

### `set-current-question-info`

#### Associated State Variable

`currentQuestionInfo`

#### Payload

A question object.

#### Usage

Sets the `currentQuestionInfo` variable to the retrieved value from the `questions` array.

### `set-websocket`

#### Associated State Variable

`websocket`

#### Payload

A WebSocket connection

#### Usage

Sets the `websocket` variable to the current active WebSocket connection.

### `clear-websocket`

#### Associated State Variable

`websocket`

#### Payload

None

#### Usage

Sets the `websocket` variable to `null`.

### `update-questions`

#### Associated State Variable

`questions`

#### Payload

2D array of arrays of questions.

#### Usage

Updates the `questions` array with the latest info from the backend.

### `set-course-id`

#### Associated State Variable

`courseId`

#### Payload

String

#### Usage

Updates the `courseId` variable.

### `set-jwt`

#### Associated State Variable

`jwt`

#### Payload

String

#### Usage

Updates the `jwt` variable to the token retrieved after authenticating.
