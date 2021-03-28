# Interacting with the websocket

## Establish a connection

`const ws = new Websocket(url);`

## Send a message

`ws.send( JSON.stringify({ action: "routeName", param1: "x", param2: "y" }) );`

### Example: Student submit route

`ws.send( JSON.stringify({ action: "submit", optionId: "option", ucfid: "ucfid" }) );`

## Recieving messages

```
ws.onmessage = (event: MessageEvent) => {
  const message = JSON.parse(event.data);

  switch (message.action) {
    case "startQuestion":
      setQuestion(message.payload.question);
      break;
    case "endQuestion":
      setQuestion(null);
      break;
    case "endSession":
      // go back to home screen
      break;
  }
};
```

## Close Connection

`ws.close()`

# Websocket Routes

## Standard

These messages are sent automatically from the client to server when establishing and severing a websocket connection

### $connect

- **returns** successful connection to websocket server

### $disconnect

- **returns** success disconnecting

## From Student

Messages the student will send to the server

### studentJoinRoom

Student joins room for their course.
Also checks for an already open session/question.
If there is, student will recieve `startSession` and `startQuestion` respectively.

- **payload** `courseId: String`
- **returns** success joining room

### leaveRoom

Student leaves a specific room

- **payload** `courseId: String`
- **returns** success leaving room

### submit

Student submits response to a question

- **payload** `courseId: String, questionId: String, optionId: String, ucfid: String, sessionId: String`
- **returns** success submitting response

### joinSession

student joins the session, notifying professor

- **payload** `courseId: String`
- **returns** success joining session

### leaveSession

student leaves the session, notifying professor

- **payload** `courseId: String`
- **returns** success leaving session

## To Student

Messages the student will receive from the server, in the form
`{action: "action", payload: { payload } }`

### startSession

- **payload** `name: String, id:Number`

### startQuestion

- **payload** `question: QuestionObject`

### endQuestion

- **payload** `n/a`

### endSession

- **payload** `n/a`

## From Professor

Messages the professor will send to the server

### professorJoinRoom

Professor joins room for their course

- **payload** `courseId: String`
- **returns** success joining room

### startSession

Professor starts a session for students to join. This is handled
automatically by the rest route POST /api/v1/session

- **payload** `courseId: String, sessionId: Number, sessionName: String`
- **returns** success starting session

### endSession

Professor ends the session, notifying students

- **payload** `courseId: String`
- **returns** success ending session

### startQuestion

Professor starts question for a room, allowing responses to be submitted

- **payload** `courseId: String, question: QuestionObject`
- **returns** success starting question

### endQuestion

Professor ends question for a room, preventing further
responses from being submitted.

- **payload** `courseId: String`
- **returns** success ending question

## To Professor

Messages the student will receive from the server, in the form
`{action: "action", payload: { payload } }`

### studentJoined

recieved once for each student that joins the session, so the number of connected students can be incremented

- **payload** `n/a`

### studentLeft

received once for each student that leaves the session, so the number of connected students can be decremented

- **payload** `n/a`

### studentSubmitted

received once for each student that submits a response to the open question, so the number of responses can be incremented. This will not be received if a student changes their answer.

- **payload** `n/a`
