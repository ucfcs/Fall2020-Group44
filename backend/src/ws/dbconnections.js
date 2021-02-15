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
   * params
   * - key: roomId == courseId
   * - connectionId: websocket connectionId of student
   * returns
   * - success of dynamodb update
   *****************************************************/
	async addStudent(courseId, connectionId) {
		const updateParams = {
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
			await this.client.update(updateParams).promise()
			console.log(`DynamoDB student ${connectionId} added to room ${courseId}: `)
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
		const getParams = {
			TableName: process.env.TABLE_NAME,
			Key: {
				courseId: room
			}
		}

		try {
			this.client.get(getParams, function(err, data) {
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
		const putParams = {
			TableName: process.env.TABLE_NAME,
			Item: {
				courseId: courseId,
				professor: connectionId,
				connections: this.client.createSet([connectionId])
			},
			ConditionExpression: 'attribute_not_exists(courseId)'
		}

		try {
			await this.client.put(putParams).promise();
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

		await this.client.update(params).promise()
	}

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

	async publish(courseId, action, payload=null) {
		const connections = await this.getConnections(courseId)
		console.log('connections:')
		console.log(connections)

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
				if(e.statusCode == 410) {
					console.log(`Found stale connection, deleting connectionId ${connectionId}`)
					await this.removeStudent(courseId, connectionId)
				}
        console.log(e)
      }
		}
	}

}