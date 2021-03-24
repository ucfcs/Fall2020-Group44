# Interacting with the websocket

## Establish a connection
`const ws = new Websocket(url);`

## Send a message
`ws.send(
  JSON.stringify({
    action: "routeName",
    payload
  })
);`

### Example: Student submit route
`ws.send(
  JSON.stringify({
    action: "routeName",
    optionId: "option",
    ucfid: "ucfid"
  })
);`

## Close Connection
`ws.close()`

# Websocket Routes

## Standard

### $connect
- **returns** successful connection to websocket server

### $disconnect
if the disconnected connection was the professor, close the room. 
- **returns** success disconnecting

### $default

## From Student

### join
Student request to join a specific room
- **payload** `courseId: String`
- **returns** success joining room

### submit
Student submits response to a question
- **payload** `optionId: Number, ucfid: String`
- **returns** success submitting response

## From Professor

### createRoom
Professor creates a room for students to join
- **payload** `courseId: String`
- **returns** success creating room

### closeRoom
Professor closes the room when finished
- **payload** `courseId: String`
- **returns** success closing room

### startQuestion
Professor starts question for a room, allowing responses to be submitted
- **payload** `courseId: String, question: QuestionObject`
- **returns** success starting question

### endQuestion
Professor ends question for a room, preventing further
responses from being submitted.
- **payload** `courseId: String`
- **returns** success ending question
