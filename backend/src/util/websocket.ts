import AWS from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QuestionUserResponse } from '../models/QuestionUserResponse';

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
	async joinRoom(
		courseId: string,
		connectionId: string,
		isProfessor: boolean
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
			// add person to the room
			await this.client?.update(params).promise();
			console.log(`DynamoDB: ${connectionId} added to room ${courseId}: `);

			// if they are a professor, also set professor connectionId
			if (isProfessor) {
				const profParams = {
					TableName: process.env.TABLE_NAME as string,
					Key: {
						courseId: courseId,
					},
					UpdateExpression: 'SET professor = :p',
					ExpressionAttributeValues: {
						':p': connectionId,
					},
					ConditionExpression: 'attribute_exists(courseId)',
				};

				await this.client?.update(profParams).promise();
				console.log(
					`DynamoDB: ${connectionId} set to professor in room ${courseId}`
				);
			}

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully added to room ${courseId}`,
				}),
			};
		} catch (error) {
			console.log(
				`DynamoDB: Error adding ${connectionId} to room ${courseId}:`
			);
			// specific error for room does not exist. create a new one
			if (error.code == 'ConditionalCheckFailedException') {
				console.log(`DynamoDB: room ${courseId} does not exist. creating now`);
				return this.createRoom(courseId, connectionId, isProfessor);
			}
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `DynamoDB UPDATE error when adding ${connectionId} to room ${courseId}`,
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
		connectionId: string,
		isProfessor: boolean
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Item: {
				courseId: courseId,
				professor: isProfessor ? connectionId : 'none',
				connections: this.client?.createSet([connectionId]),
				questionOpen: false,
				session: {
					id: 0,
					name: 'none',
				},
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
	 * close the room in DynamoDB by deleting the room item
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

			//delete the room from DynamoDB
			await this.client?.delete(params).promise();

			// otherwise all was successful
			console.log(`room ${courseId} closed successfully`);
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
	 * remove a connectionId from the SET if
	 * their websocket connection has gone 'stale' i.e.
	 * no longer connected
	 *
	 *
	 * params
	 * - courseId, connectionId
	 * returns
	 * - success of DynamoDB connection set update
	 *****************************************************/
	async leaveRoom(
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
			ReturnValues: 'UPDATED_NEW',
		};

		try {
			//remove connection from the room
			const result = await this.client?.update(params).promise();

			//if the room is now empty, delete it
			const updatedConnections = result?.Attributes?.connections.values;
			if (!updatedConnections || updatedConnections.length == 0) {
				return await this.closeRoom(courseId);
			}

			// should also probably set the professor to 'none' if the
			// person that left was professor. however it doesn't affect
			// anything if you leave the professor the same

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: 'left room successfully',
				}),
			};
		} catch (error) {
			console.log(`Error removing ${connectionId} from room ${courseId}`);
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `DynamoDB UPDATE error when removing ${connectionId} from room ${courseId}`,
				}),
			};
		}
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
			} else {
				console.log(
					`Error posting message to professor for room ${courseId}: ${err}`
				);
				return {
					statusCode: 400,
					body: JSON.stringify({
						message: `Error posting message to professor for room ${courseId}`,
					}),
				};
			}
		}
	}

	/******************************************************
	 * start a session by
	 * - sending `startSession` to the students
	 * - updating session params in dynamodb table
	 *
	 * params
	 * - courseId, sessionName, sessionId
	 * returns
	 * - success of session start
	 *****************************************************/
	async startSession(
		courseId: string,
		sessionId: number,
		sessionName: string
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			UpdateExpression: 'SET #s.#id = :id, #s.#name = :name',
			ExpressionAttributeValues: {
				':id': sessionId,
				':name': sessionName,
			},
			ExpressionAttributeNames: {
				'#s': 'session',
				'#id': 'id',
				'#name': 'name',
			},
			ConditionExpression: 'attribute_exists(courseId)',
		};

		try {
			await this.client?.update(params).promise();

			await this.publish(courseId, 'startSession', {
				sessionName: sessionName,
				sessionId: sessionId,
			});

			console.log(
				`session ${sessionId}:${sessionName} started in room ${courseId}`
			);

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully started session in room ${courseId}`,
				}),
			};
		} catch (error) {
			console.log(`error starting session in room ${courseId}:`);
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `Error starting session in room ${courseId}`,
				}),
			};
		}
	}

	/******************************************************
	 * end a session by
	 * - sending `endSession` to the students
	 * - updating session params in dynamodb table to default
	 *
	 * params
	 * - courseId
	 * returns
	 * - success of session end
	 *****************************************************/
	async endSession(courseId: string): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			UpdateExpression: 'SET #s.#id = :id, #s.#name = :name',
			ExpressionAttributeValues: {
				':id': 0,
				':name': 'none',
			},
			ExpressionAttributeNames: {
				'#s': 'session',
				'#id': 'id',
				'#name': 'name',
			},
			ConditionExpression: 'attribute_exists(courseId)',
		};

		try {
			await this.client?.update(params).promise();

			await this.publish(courseId, 'endSession');

			console.log(`session ended in room ${courseId}`);

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully ended session in room ${courseId}`,
				}),
			};
		} catch (error) {
			console.log(`error ending session in room ${courseId}:`);
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `Error ending session in room ${courseId}`,
				}),
			};
		}
	}

	/******************************************************
	 * student joins a session by notifying the professor
	 *
	 * params
	 * - courseId
	 * returns
	 * - success of notifying professor
	 *****************************************************/
	async joinSession(courseId: string): Promise<APIGatewayProxyResult> {
		try {
			await this.sendToProfessor(courseId, 'studentJoined');

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully joined session in room ${courseId}`,
				}),
			};
		} catch (error) {
			console.log(`student unable to join session in room ${courseId}`);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `error joining session in room ${courseId}`,
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
	async submitResponse(
		courseId: string,
		questionId: string,
		questionOptionId: string,
		userId: string,
		sessionId: string
	): Promise<APIGatewayProxyResult> {
		try {
			// attempt to create response in db
			const result = await QuestionUserResponse.create({
				questionId: parseInt(questionId),
				userId: parseInt(userId),
				sessionId: parseInt(sessionId),
				questionOptionId: parseInt(questionOptionId),
			});

			console.log(result);
			// if successful, tell the professor a NEW response was recorded
			await this.sendToProfessor(courseId, 'studentSubmitted');

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: 'successfully submitted response',
				}),
			};
		} catch (error) {
			// if this student already submitted for this question,
			// i.e. record already exists in db
			if (error.name == 'SequelizeUniqueConstraintError') {
				// then we want to update an existing response,
				// but not notify the professor
				console.log('response already exists. updating...');
				try {
					await QuestionUserResponse.update(
						{
							questionOptionId: parseInt(questionOptionId),
						},
						{
							where: {
								questionId: questionId,
								userId: userId,
								sessionId: sessionId,
							},
						}
					);

					return {
						statusCode: 200,
						body: JSON.stringify({
							message: 'successfully updated student response',
						}),
					};
				} catch (error) {
					console.log('error updating existing student response:');
					console.log(error);
					return {
						statusCode: 400,
						body: JSON.stringify({
							message: 'error updating existing student response',
						}),
					};
				}
			}

			// different error besides unique constraint
			console.log('error inserting new student response:');
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: 'error submitting new student response',
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
					await this.leaveRoom(courseId, connectionId);
				} else {
					console.log(e);
				}
			}
		}
	}
}
