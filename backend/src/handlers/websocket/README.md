# Interacting with the websocket

## Establish a connection

`const ws = new Websocket(url);`

## Send a message

`ws.send( JSON.stringify({ action: "routeName", payload }) );`

### Example: Student submit route

`ws.send( JSON.stringify({ action: "routeName", optionId: "option", ucfid: "ucfid" }) );`

## Close Connection

`ws.close()`

# Websocket Routes

## Standard

### $connect

- **returns** successful connection to websocket server

### $disconnect

- **returns** success disconnecting

### $default

## From Student

### studentJoin

Student joins room for their course

- **payload** `courseId: String`
- **returns** success joining room

### leaveRoom

Student leaves a specific room

- **payload** `courseId: String`
- **returns** success leaving room

### submit

Student submits response to a question

- **payload** `optionId: Number, ucfid: String`
- **returns** success submitting response

## From Professor

### professorJoin

Professor joins room for their course

- **payload** `courseId: String`
- **returns** success joining room

### startSession

Professor starts a session for students to join. This is handled
automatically by the rest route POST /api/v1/session

- **payload** `courseId: String, sessionId: Number, sessionName: String`
- **returns** success starting question

### startQuestion

Professor starts question for a room, allowing responses to be submitted

- **payload** `courseId: String, question: QuestionObject`
- **returns** success starting question

### endQuestion

Professor ends question for a room, preventing further
responses from being submitted.

- **payload** `courseId: String`
- **returns** success ending question
