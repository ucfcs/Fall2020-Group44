import AWS from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import fetch from 'node-fetch';

export class Connection {
	client?: AWS.DynamoDB.DocumentClient;
	gateway?: AWS.ApiGatewayManagementApi;

	init(event?: APIGatewayEvent): void {
		this.client = new AWS.DynamoDB.DocumentClient({
			apiVersion: '2012-08-10',
			region: 'localhost',
			endpoint: 'http://localhost:8000',
		});

		this.gateway = new AWS.ApiGatewayManagementApi({
			apiVersion: '2018-11-29',
			endpoint:
				process.env.NODE_ENV == 'development'
					? 'http://localhost:3001'
					: `${event?.requestContext.domainName}/${event?.requestContext.stage}`,
		});
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
	async addStudent(
		courseId: string,
		connectionId: string
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			UpdateExpression: 'ADD connections :c',
			ExpressionAttributeValues: {
				':c': this.client?.createSet([connectionId]),
			},
			ConditionExpression: 'attribute_exists(courseId)',
		};

		try {
			// add student to the room
			await this.client?.update(params).promise();
			console.log(
				`DynamoDB student ${connectionId} added to room ${courseId}: `
			);

			// inform professor that student has connected
			await this.sendToProfessor(courseId, 'studentConnected');

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully added to room ${courseId}`,
				}),
			};
		} catch (error) {
			console.log(`Error adding student ${connectionId} to room ${courseId}:`);
			// specific error for room does not exist
			if (error.code == 'ConditionalCheckFailedException') {
				console.log(`room ${courseId} does not exist`);
				return {
					statusCode: 402,
					body: JSON.stringify({
						message: 'RoomNotExistsException',
					}),
				};
			}
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `DynamoDB UPDATE error when adding student to room ${courseId}`,
				}),
			};
		}
	}

	/******************************************************
	 * check if room key exists
	 * params
	 * - key: roomId == courseId
	 * returns
	 * - 1 if room exists, 0 otherwise
	 *****************************************************/
	async roomExists(courseId: string): Promise<1 | 0> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
		};

		try {
			const result = await this.client?.get(params).promise();

			// if there is no result return 0
			if (!result) {
				return 0;
			}

			// if the room does not exist, return falsey
			if (Object.keys(result).length == 0) {
				return 0;
			}

			// it does exist, return truthy
			return 1;
		} catch (error) {
			console.log(`Error getting room ${courseId}:`);
			console.log(error);
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
	async createRoom(
		courseId: string,
		connectionId: string
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Item: {
				courseId: courseId,
				professor: connectionId,
				connections: this.client?.createSet([connectionId]),
				questionOpen: false,
			},
			ConditionExpression: 'attribute_not_exists(courseId)',
		};

		try {
			await this.client?.put(params).promise();
			console.log(`room ${courseId} successfully created`);
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `room ${courseId} created successfully`,
				}),
			};
		} catch (error) {
			console.log(`Error creating room ${courseId}:`);

			// specific error for room already exists
			if (error.code == 'ConditionalCheckFailedException') {
				console.log(`the room ${courseId} already exists`);
				return {
					statusCode: 401,
					body: JSON.stringify({
						message: 'RoomExistsException',
					}),
				};
			}
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `DynamoDB PUT error when creating room ${courseId}`,
				}),
			};
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
	async closeRoom(courseId: string): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
		};

		try {
			// first check if room exists
			if ((await this.roomExists(courseId)) == 0) {
				throw `room ${courseId} does not exist`;
			}

			// publish endSession to all students
			await this.publish(courseId, 'endSession');

			//delete the room from DynamoDB
			const result = await this.client?.delete(params).promise();
			console.log(result);

			// otherwise all was successful
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `room ${courseId} closed successfully`,
				}),
			};
		} catch (error) {
			console.log(`Error closing room ${courseId}`);
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `DynamoDB DELETE error when closing room ${courseId}`,
				}),
			};
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
	async removeStudent(
		courseId: string,
		connectionId: string
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			UpdateExpression: 'DELETE connections :c',
			ExpressionAttributeValues: {
				':c': this.client?.createSet([connectionId]),
			},
		};

		//remove student connection from the room
		await this.client?.update(params).promise();

		// inform the professor that a student disconnected
		return await this.sendToProfessor(courseId, 'studentDisconnected');
	}

	/******************************************************
	 * Check if a disconnected connectionId was a professor
	 *
	 * params
	 * - connectionId
	 * returns
	 * - courseId if matching a professor, null otherwise
	 *****************************************************/
	async isProfessor(connectionId: string): Promise<CourseId | null> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			IndexName: 'ProfessorIndex',
			KeyConditionExpression: 'professor = :c',
			ExpressionAttributeValues: {
				':c': connectionId,
			},
		};

		const result = await this.client?.query(params).promise();
		let courseId = null;

		if (!result || !result.Count || !result.Items) {
			return null;
		}

		// if it was a professor, the result will contain the room Item
		if (result.Count > 0) {
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
	async getProfessor(courseId: string): Promise<string | null> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			AttributesToGet: ['professor'],
		};

		try {
			const data = await this.client?.get(params).promise();

			if (!data || !data.Item) {
				return null;
			}

			if (data.Item.professor) {
				return data.Item.professor;
			} else {
				throw `DynamoDB unable to GET professor for room ${courseId}`;
			}
		} catch (err) {
			console.error(`Error getting professor for room ${courseId}: ${err}`);
			return null;
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
	async sendToProfessor(
		courseId: string,
		action: string,
		payload?: unknown
	): Promise<APIGatewayProxyResult> {
		try {
			// first get professors connectionId
			const professor = await this.getProfessor(courseId);

			// there is no professor in this course
			if (professor === null) {
				throw `No professor was found within the Course with the id = ${courseId}`;
			}

			// then post message to professor
			await this.gateway
				?.postToConnection({
					ConnectionId: professor,
					Data: JSON.stringify({
						action,
						payload,
					}),
				})
				.promise();

			console.log(
				`Successfully posted message to professor for room: ${courseId}`
			);

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully posted message to professor of room ${courseId}`,
				}),
			};
		} catch (err) {
			console.log(
				`Error posting message to professor for room ${courseId}: ${err}`
			);

			// if for some reason the professor is no longer connected to the websocket, close the room
			if (err.statusCode == 410) {
				console.log(
					`The professor for room ${courseId} is no longer connected. Closing the room.`
				);
				await this.closeRoom(courseId);
				return {
					statusCode: 410,
					body: JSON.stringify({
						message: `The professor for room ${courseId} is no longer connected`,
					}),
				};
			}
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `Error posting message to professor for room ${courseId}`,
				}),
			};
		}
	}

	/******************************************************
	 * submit a users response, then notify the professor
	 * if it is not an updated response
	 *
	 * params
	 * - courseId, questionId, questionOptionId, userId
	 * returns
	 * - list of connection id's as an array of strings
	 *****************************************************/
	async sumbitResponse(
		courseId: string,
		questionId: string,
		questionOptionId: string,
		userId: string,
		sessionId: string
	): Promise<APIGatewayProxyResult> {
		const params = {
			questionId: questionId,
			questionOptionId: questionOptionId,
			userId: userId,
			sessionId: sessionId,
		};

		const endpoint =
			process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : '';

		try {
			// POST student response to DB
			const postResponse = await fetch(
				`${endpoint}/dev/api/v1/question_user_response`,
				{
					method: 'POST',
					headers: {
						'content-type': 'application/json',
					},
					body: JSON.stringify(params),
				}
			);

			// convert post response to json
			const postJson = await postResponse.json();

			// successfully inserted new response
			if (!postJson.error) {
				//publish to professor that a student submitted a NEW response
				await this.sendToProfessor(courseId, 'studentSubmitted');
			} else {
				// if we get a uniqueconstraint error, it's because
				// the user is trying to change their response to the same question
				if (postJson.error.name == 'SequelizeUniqueConstraintError') {
					// so instead we do an UPDATE request
					const updateResponse = await fetch(
						`${endpoint}/dev/api/v1/question_user_response`,
						{
							method: 'PUT',
							headers: {
								'content-type': 'application/json',
							},
							body: JSON.stringify(params),
						}
					);

					// convert the update response to json, make sure it worked
					const updateJson = await updateResponse.json();
					if (updateJson.error) {
						// console.log(updateJson);
						throw updateJson.error;
					}
					// if there is somehow a different post error
					// besides uniqueconstraint
				} else {
					throw postJson.error;
				}
			}

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: 'successfully submitted response',
				}),
			};
		} catch (error) {
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: 'error submitting student response',
				}),
			};
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
	async getConnections(courseId: string): Promise<string[]> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			AttributesToGet: ['connections'],
		};

		const data = await this.client?.get(params).promise();

		console.trace(data);

		if (!data || !data.Item) {
			return [];
		}

		return data.Item.connections.values;
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
	// TODO: i don't know what a question object looks like yet
	async startQuestion(
		courseId: string,
		question: unknown
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			UpdateExpression: 'SET questionOpen = :b',
			ExpressionAttributeValues: {
				':b': true,
			},
			ConditionExpression: 'attribute_exists(courseId)',
		};

		try {
			// first set questionOpen to true for the room
			await this.client?.update(params).promise();

			// then publish the question to all students
			await this.publish(courseId, 'startQuestion', question);

			console.log(`Question started in room ${courseId}: `);
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully started question in room ${courseId}`,
				}),
			};
		} catch (error) {
			console.log(`Error starting question in room ${courseId}:`);

			// specific error for room already exists
			if (error.code == 'ConditionalCheckFailedException') {
				console.log(`room ${courseId} does not exist`);
				return {
					statusCode: 402,
					body: JSON.stringify({
						message: 'RoomNotExistsException',
					}),
				};
			}
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `DynamoDB UPDATE error when starting question in room ${courseId}`,
				}),
			};
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
	async endQuestion(courseId: string): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			UpdateExpression: 'SET questionOpen = :b',
			ExpressionAttributeValues: {
				':b': false,
			},
			ConditionExpression: 'attribute_exists(courseId)',
		};

		try {
			// first set questionOpen to false for the room
			await this.client?.update(params).promise();

			// then publish endQuestion to all students
			await this.publish(courseId, 'endQuestion');

			console.log(`Question ended in room ${courseId}: `);
			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully ended question in room ${courseId}`,
				}),
			};
		} catch (error) {
			console.log(`Error ending question in room ${courseId}:`);

			// specific error for room already exists
			if (error.code == 'ConditionalCheckFailedException') {
				console.log(`room ${courseId} does not exist`);
				return {
					statusCode: 402,
					body: JSON.stringify({
						message: 'RoomNotExistsException',
					}),
				};
			}
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `DynamoDB UPDATE error when ending question in room ${courseId}`,
				}),
			};
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
	 *
	 * returns
	 * - n/a
	 *****************************************************/
	async publish(
		courseId: string,
		action: string,
		payload?: unknown
	): Promise<void> {
		// first get all connections for the room
		const connections = await this.getConnections(courseId);
		console.log('connections:');
		console.log(connections);

		// loop thru each connection, publishing the message
		// to them individually
		for (const connectionId of connections) {
			try {
				await this.gateway
					?.postToConnection({
						ConnectionId: connectionId,
						Data: JSON.stringify({
							action: action,
							payload: payload,
						}),
					})
					.promise();
			} catch (e) {
				// if the student is no longer connected, remove them
				// from the connection set in DynamoDB
				if (e.statusCode == 410) {
					console.log(
						`Found stale connection, deleting connectionId ${connectionId}`
					);
					await this.removeStudent(courseId, connectionId);
				}
				console.log(e);
			}
		}
	}
}
