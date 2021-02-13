# Websocket Routes

## Standard

### $connect
- **returns** successful connection to websocket server

### $disconnect
if the disconnected connection was the professor, close the room. Otherwise remove the student from the room. 
- **returns** success disconnecting

### $default

## From Student

### Join
Student request to join a specific room
- **payload** `courseId: String`
- **returns** success joining room

### Submit
Student submits response to a question
- **payload** `optionId: Number, ucfid: String`
- **returns** success submitting response

## From Professor

### Create
Professor creates a room for students to join
- **payload** `courseId: String`
- **returns** success creating room

### StartQuestion
Professor starts question for a room, allowing responses to be submitted
- **payload** `courseId: String, question: QuestionObject`
- **returns** success starting question

### EndQuestion
Professor ends question for a room, preventing further
responses from being submitted.
- **payload** `courseId: String`
- **returns** success ending question