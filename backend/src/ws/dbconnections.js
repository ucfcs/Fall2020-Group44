const AWS = require('aws-sdk')

export class Connection {
	constructor() {}

	init (event) {
    this.client = new AWS.DynamoDB.DocumentClient({ 
			apiVersion: '2012-08-10', 
			region: 'localhost', 
			endpoint: 'http://localhost:8000' 
		});

    this.gateway = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: process.env.NODE_ENV == 'development' ? 'http://localhost:3001' : event.requestContext.domainName + '/' + event.requestContext.stage
    })
	}
	
	/******************************************************
   * add student to set of connectionIds for a room
	 * 
	 * inform the professor with message `studentConnected`
	 * 
   * params
   * - key: roomId == courseId
   * - connectionId: websocket connectionId of student
   * returns
   * - success of dynamodb update
   *****************************************************/
	async addStudent(courseId, connectionId) {
		const params = {
			TableName: process.env.TABLE_NAME,
			Key: {
				"courseId": courseId
			},
			UpdateExpression: 'ADD connections :c',
			ExpressionAttributeValues: {
				':c': this.client.createSet([connectionId])
			},
			ConditionExpression: 'attribute_exists(courseId)'
		}

		try {
			// add student to the room
			await this.client.update(params).promise()
			console.log(`DynamoDB student ${connectionId} added to room ${courseId}: `)

			// inform professor that student has connected
			await this.sendToProfessor(courseId, "studentConnected")

			return {
				statusCode: 200, 
				body: JSON.stringify({
					message: `successfully added to room ${courseId}`
				})
			}
		} catch (error) {
			console.log(`Error adding student ${connectionId} to room ${courseId}`)
			console.log(error)
			// specific error for room already exists
			if(error.code == 'ConditionalCheckFailedException') {
				return {
					statusCode: 402, 
					body: JSON.stringify({
						message: 'RoomNotExistsException'
					})
				}
			}
			return {
				statusCode: 400, 
					body: JSON.stringify({
						message: `DynamoDB UPDATE error when adding student to room ${courseId}`
					})
			}
		}
		
	}

	/******************************************************
   * check if room key exists
   * params
   * - key: roomId == courseId
   * returns
   * - 1 if room exists, 0 otherwise
   *****************************************************/
	roomExists(room) {
		const params = {
			TableName: process.env.TABLE_NAME,
			Key: {
				courseId: room
			}
		}

		try {
			this.client.get(params, function(err, data) {
				if (err) throw err
				else {
					// room does not exist in table
					if (Object.keys(data).length == 0) return 0;
					// otherwise return 1: room does exist
					console.log(data)
					return 1;
				}
			})
		} catch (error) {
			console.log(`Error getting room ${room}:`)
			console.log(error)
			return 0;
		}
	}

	/******************************************************
   * create room item in DynamoDB with courseId as the 
	 * primary key, professor's connectionId as the 
	 * secondary index, and start the list of connections
	 * which students will be added to when they join
	 * 
   * params
   * - courseId, connectionId of professor
   * returns
   * - success of DynamoDB PUT
   *****************************************************/
	async createRoom(courseId, connectionId) {
		const params = {
			TableName: process.env.TABLE_NAME,
			Item: {
				courseId: courseId,
				professor: connectionId,
				connections: this.client.createSet([connectionId]),
				questionOpen: false
			},
			ConditionExpression: 'attribute_not_exists(courseId)'
		}

		try {
			await this.client.put(params).promise();
			console.log(`room ${courseId} successfully created`)
			return {
				statusCode: 200, 
				body: JSON.stringify({
					message: `room ${courseId} created successfully`
				})
			}
		} catch(error) {
			console.log(`Error creating room ${courseId}`)
			console.log(error)
			// specific error for room already exists
			if(error.code == 'ConditionalCheckFailedException') {
				return {
					statusCode: 401, 
					body: JSON.stringify({
						message: 'RoomExistsException'
					})
				}
			}
			return {
				statusCode: 400, 
					body: JSON.stringify({
						message: `DynamoDB PUT error when creating room ${courseId}`
					})
			}
		}
	}

	/******************************************************
   * close the room in DynamoDB by
	 * - publishing `endSession` to all connections
	 * - deleting the room item from DynamoDB
	 * 
   * params
   * - courseId
   * returns
   * - success of DynamoDB delete
   *****************************************************/
	async closeRoom(courseId) {
		const params = {
			TableName: process.env.TABLE_NAME,
			Key: {
				courseId: courseId
			}
		}

		try {
			// publish endSession to all students
			await this.publish(courseId, "endSession");

			//delete the room from DynamoDB
			const result = await this.client.delete(params).promise()
			console.log(result)
			
			// if the room did not exist, throw an error
			if(Object.entries(result).length !== 0) {
				throw `room ${courseId} does not exist`
			}

			// otherwise all was successful
			return {
				statusCode: 200, 
				body
				: JSON.stringify({
					message: `room ${courseId} closed successfully`
				})
			}
		} catch(error) {
			console.log(`Error closing room ${courseId}`)
			console.log(error)
			return {
				statusCode: 400, 
					body: JSON.stringify({
						message: `DynamoDB DELETE error when closing room ${courseId}`
					})
			}
		}
		
	}

	/******************************************************
   * remove a student connectionId from the SET if 
	 * their websocket connection has gone 'stale' i.e.
	 * no longer connected
	 * 
	 * inform the professor with message `studentDisconnected`
	 * 
   * params
   * - courseId, connectionId of student
   * returns
   * - success of DynamoDB connection set update
   *****************************************************/
	async removeStudent(courseId, connectionId) {
		const params = {
			TableName: process.env.TABLE_NAME,
			Key: {
				"courseId": courseId
			},
			UpdateExpression: 'DELETE connections :c',
			ExpressionAttributeValues: {
				':c': this.client.createSet([connectionId])
			}
		}

		//remove student connection from the room
		await this.client.update(params).promise()

		// inform the professor that a student disconnected
		await this.sendToProfessor(courseId, "studentDisconnected");

	}

	/******************************************************
   * Check if a disconnected connectionId was a professor
	 * 
   * params
   * - connectionId
   * returns
   * - courseId if matching a professor, null otherwise
   *****************************************************/
	async isProfessor(connectionId) {
		params = {
			TableName: process.env.TABLE_NAME,
			IndexName: "ProfessorIndex",
			KeyConditionExpression: "professor = :c",
			ExpressionAttributeValues: {
				":c": {
					"S": connectionId
				}
			}
		}

		const result = await this.client.query(params).promise();
		const courseId = null;

		// if it was a professor, the result will contain the room Item
		if(result.Count > 0) {
			courseId = result.Items[0].courseId;
		}

		return courseId;
	}

	/******************************************************
   * Get professors connectionId for a given room
	 * 
   * params
   * - courseId
   * returns
   * - connectionId of professor if successful
   *****************************************************/
	async getProfessor(courseId) {
		params = {
			TableName: process.env.TABLE_NAME,
			Key: {
				courseId: courseId
			},
			AttributesToGet: [
				'professor'
			]
		}

		try {
			console.log(`getting professor for room: ${courseId}`)
			const data = await this.client.get(params).promise();
			console.log(data)
			const professor = data.Item.professor.value;
			console.log(professor)

			return professor;

		} catch (err) {
			console.log(`Error getting professor for room ${courseId}: ${err}`)
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `Error getting professor for room ${courseId}`
				})
			}
		}
			
	}

	/******************************************************
   * send a websocket message to the professor only
	 * 
   * params
   * - courseId, action, payload object (optional)
   * returns
   * - success of posting message
   *****************************************************/
	async sendToProfessor(courseId, action, payload=null) {
		try {
			// first get professors connectionId
			const professor = await this.getProfessor(courseId);

			// then post message to professor
			await this.gateway.postToConnection({
				ConnectionId: professor, 
				Data: JSON.stringify({ 
					action: action, 
					payload: payload  
				})
			}).promise();

			console.log(`Successfully posted message to professor for room: ${courseId}`)

			return {
				statusCode: 200, 
				body: JSON.stringify({
					message: `successfully posted message to professor of room ${courseId}`
				})
			}

		} catch (err) {
			console.log(`Error posting message to professor for room ${courseId}: ${err}`)
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `Error posting message to professor for room ${courseId}`
				})
			}
		}
	}

	/******************************************************
   * Get a list of connectionIds for a particular room
	 * 
   * params
   * - courseId
   * returns
   * - list of connection id's as an array of strings
   *****************************************************/
	async getConnections(courseId) {
		const params = {
			TableName: process.env.TABLE_NAME,
			Key: {
				courseId: courseId
			},
			AttributesToGet: [
				'connections'
			]
		}

		const data = await this.client.get(params).promise();
		console.log(data)
		return data.Item.connections.values
	}

	/******************************************************
   * start a question for a given room by:
	 * - setting questionOpen to `true` for the room
	 * - publishing the question to all students
	 * 
   * params
   * - courseId, question object
   * returns
   * - success of both operations
   *****************************************************/
	async startQuestion(courseId, question) {
		const params = {
			TableName: process.env.TABLE_NAME,
			Key: {
				"courseId": courseId
			},
			UpdateExpression: "SET questionOpen :boolean",
			ExpressionAttributeValues: {
				':boolean': { "BOOL": true }
			},
			ConditionExpression: 'attribute_exists(courseId)'
		}

		try {
			// first set questionOpen to true for the room
			await this.client.update(params).promise()
			
			// then publish the question to all students
			await this.publish(courseId, "startQuestion", question)

			console.log(`Question started in room ${courseId}: `)
			return {
				statusCode: 200, 
				body: JSON.stringify({
					message: `successfully started question in room ${courseId}`
				})
			}
		} catch (error) {
			console.log(`Error starting question in room ${courseId}`)
			console.log(error)
			// specific error for room already exists
			if(error.code == 'ConditionalCheckFailedException') {
				return {
					statusCode: 402, 
					body: JSON.stringify({
						message: 'RoomNotExistsException'
					})
				}
			}
			return {
				statusCode: 400, 
					body: JSON.stringify({
						message: `DynamoDB UPDATE error when starting question in room ${courseId}`
					})
			}
		}
	}

	/******************************************************
   * end a question for a given room by:
	 * - setting questionOpen to `false` for the room
	 * - publishing endQuestion to all students
	 * 
   * params
   * - courseId
   * returns
   * - success of both operations
   *****************************************************/
	async endQuestion(courseId) {
		const params = {
			TableName: process.env.TABLE_NAME,
			Key: {
				"courseId": courseId
			},
			UpdateExpression: "SET questionOpen :boolean",
			ExpressionAttributeValues: {
				':boolean': { "BOOL": false }
			},
			ConditionExpression: 'attribute_exists(courseId)'
		}

		try {
			// first set questionOpen to false for the room
			await this.client.update(params).promise()
			
			// then publish endQuestion to all students
			await this.publish(courseId, "endQuestion")

			console.log(`Question ended in room ${courseId}: `)
			return {
				statusCode: 200, 
				body: JSON.stringify({
					message: `successfully ended question in room ${courseId}`
				})
			}
		} catch (error) {
			console.log(`Error ending question in room ${courseId}`)
			console.log(error)
			// specific error for room already exists
			if(error.code == 'ConditionalCheckFailedException') {
				return {
					statusCode: 402, 
					body: JSON.stringify({
						message: 'RoomNotExistsException'
					})
				}
			}
			return {
				statusCode: 400, 
					body: JSON.stringify({
						message: `DynamoDB UPDATE error when ending question in room ${courseId}`
					})
			}
		}
	}

	/******************************************************
   * Publish a message to all connections in the room. 
	 * published in the format 
	 * {
	 * 	action: an common action for the client to act on,
	 *  payload: associated data if relevant to the action
	 * }
	 * 
   * params
   * - courseId, action, payload (optional)
   * returns
   * - n/a
   *****************************************************/
	async publish(courseId, action, payload=null) {
		// first get all connections for the room
		const connections = await this.getConnections(courseId)
		console.log('connections:')
		console.log(connections)

		// loop thru each connection, publishing the message 
		// to them individually
		for (const connectionId of connections) {
			try {
        await this.gateway.postToConnection({ 
					ConnectionId: connectionId, 
					Data: JSON.stringify({ 
						action: action, 
						payload: payload 
					})
				}).promise()
      } catch (e) {
				// if the student is no longer connected, remove them
				// from the connection set in DynamoDB
				if(e.statusCode == 410) {
					console.log(`Found stale connection, deleting connectionId ${connectionId}`)
					await this.removeStudent(courseId, connectionId)
				}
        console.log(e)
      }
		}
	}

}