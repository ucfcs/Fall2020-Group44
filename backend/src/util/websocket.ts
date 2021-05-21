import AWS from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

import dynamodb from '../config/dynamo';
import { QuestionUserResponse } from '../models/QuestionUserResponse';
import responses from './api/responses';

export class Connection {
	client?: AWS.DynamoDB.DocumentClient;
	gateway?: AWS.ApiGatewayManagementApi;

	public init(event: APIGatewayEvent): void {
		this.client = new AWS.DynamoDB.DocumentClient({
			apiVersion: '2012-08-10',
			endpoint: dynamodb.config.endpoint,
			region: dynamodb.config.region,
			credentials: dynamodb.config.credentials,
		});

		this.gateway = new AWS.ApiGatewayManagementApi({
			apiVersion: '2018-11-29',
			endpoint:
				process.env.NODE_ENV == 'development'
					? 'http://localhost:3001'
					: `${event?.requestContext.domainName}/${event?.requestContext.stage}`,
			credentials: dynamodb.config.credentials,
		});
	}

	/******************************************************
	 * add student to set of connectionIds for a room
	 *
	 * inform the professor with message `studentConnected`
	 *
	 * params
	 * - courseId
	 * - connectionId
	 * - isProfessor
	 * returns
	 * - success of dynamodb update
	 *****************************************************/
	public async joinRoom(
		courseId: string,
		connectionId: string,
		isProfessor: boolean
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
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
					TableName: process.env.DYNAMO_TABLE_NAME as string,
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
	 * check if there is an open session when a student
	 * joins the room. if so, send a startSession to
	 * the student
	 *
	 * params
	 * - courseId, connectionId
	 * returns
	 * - success of check
	 *****************************************************/
	public async checkOpenSession(
		courseId: string,
		connectionId: string
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			AttributesToGet: ['session', 'question'],
		};

		try {
			const result = await this.client?.get(params).promise();

			const session = result?.Item?.session;

			if (session.id !== 0) {
				this.publish(connectionId, 'startSession', session);

				// if open session, check for open question as well
				const question = result?.Item?.question;
				if (question) {
					this.publish(connectionId, 'startQuestion', question);
				}
			}

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully checked for open session in ${courseId}`,
				}),
			};
		} catch (error) {
			console.log(
				`DynamoDB: error checking for open session in room ${courseId}`
			);
			console.log(error);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `DynamoDB error checking for open session in room ${courseId}`,
				}),
			};
		}
	}

	/******************************************************
	 * check if room key exists
	 * params
	 * - courseId
	 * returns
	 * - 1 if room exists, 0 otherwise
	 *****************************************************/
	private async roomExists(courseId: string): Promise<1 | 0> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
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
	 * - courseId, connectionId, isProfessor
	 * returns
	 * - success of DynamoDB PUT
	 *****************************************************/
	private async createRoom(
		courseId: string,
		connectionId: string,
		isProfessor: boolean
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
			Item: {
				courseId: courseId,
				professor: isProfessor ? connectionId : 'none',
				connections: this.client?.createSet([connectionId]),
				question: null,
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
	public async closeRoom(courseId: string): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
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
	public async leaveRoom(
		courseId: string,
		connectionId: string
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			UpdateExpression: 'DELETE connections :c',
			ExpressionAttributeValues: {
				':c': this.client?.createSet([connectionId]),
			},
			ReturnValues: 'ALL_NEW',
		};

		try {
			//remove connection from the room
			const result = await this.client?.update(params).promise();

			//if the room is now empty, delete it
			const updatedConnections =
				result?.Attributes?.connections?.values || null;
			if (!updatedConnections || updatedConnections.length == 0) {
				return await this.closeRoom(courseId);
			}

			// if they are a professor, also remove professor connectionId
			if (result?.Attributes?.professor == connectionId) {
				const profParams = {
					TableName: process.env.DYNAMO_TABLE_NAME as string,
					Key: {
						courseId: courseId,
					},
					UpdateExpression: 'SET professor = :p',
					ExpressionAttributeValues: {
						':p': 'none',
					},
					ConditionExpression: 'attribute_exists(courseId)',
				};

				await this.client?.update(profParams).promise();
				console.log(
					`DynamoDB: ${connectionId} removed as professor in room ${courseId}`
				);
			}

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
	private async isProfessor(connectionId: string): Promise<CourseId | null> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
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
	private async getProfessor(courseId: string): Promise<string | null> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
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
	private async sendToProfessor(
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

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully posted message to professor of room ${courseId}`,
				}),
			};
		} catch (err) {
			// the professor is no longer connected to the websocket
			if (err.statusCode == 410) {
				console.log(
					`The professor for room ${courseId} is no longer connected.`
				);
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
	public async startSession(
		courseId: string,
		sessionId: number,
		sessionName: string
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
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

			await this.publishAll(courseId, 'startSession', {
				name: sessionName,
				id: sessionId,
				courseId,
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
	public async endSession(courseId: string): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			UpdateExpression: 'SET #s.#id = :id, #s.#name = :name, #q = :q',
			ExpressionAttributeValues: {
				':id': 0,
				':name': 'none',
				':q': null,
			},
			ExpressionAttributeNames: {
				'#s': 'session',
				'#id': 'id',
				'#name': 'name',
				'#q': 'question',
			},
			ConditionExpression: 'attribute_exists(courseId)',
			ReturnValues: 'ALL_OLD',
		};

		try {
			const result = await this.client?.update(params).promise();

			await this.publishAll(courseId, 'endSession');

			console.log(`session ended in room ${courseId}`);

			const sessionId = result?.Attributes?.session.id;

			if (!sessionId) {
				throw `sessionId of session ended in ${courseId} not obtainable from DynamoDB`;
			}

			return responses.ok({
				message: `Success calculating grades for sessionId ${sessionId}`,
			});
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
	public async joinSession(courseId: string): Promise<APIGatewayProxyResult> {
		try {
			await this.sendToProfessor(courseId, 'studentJoined');

			console.log(`student joined session in room ${courseId}`);
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
	 * student leaves a session by notifying the professor
	 *
	 * params
	 * - courseId
	 * returns
	 * - success of notifying professor
	 *****************************************************/
	public async leaveSession(courseId: string): Promise<APIGatewayProxyResult> {
		try {
			await this.sendToProfessor(courseId, 'studentLeft');

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `successfully left session in room ${courseId}`,
				}),
			};
		} catch (error) {
			console.log(`student error leaving session in room ${courseId}`);
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: `error leaving session in room ${courseId}`,
				}),
			};
		}
	}

	/******************************************************
	 * validates the response parameters of an attempted
	 * submit, verifying quesitonId, sessionId, and that
	 * the provided questionOptionId is one of the
	 * QuestionOptions of the current question
	 *
	 * params
	 * - courseId, questionId, questionOptionId, sessionId
	 * returns
	 * - true if valid, otherwise false
	 *****************************************************/
	private async validateSubmit(
		courseId: string,
		questionId: string,
		questionOptionId: string,
		sessionId: string
	): Promise<number> {
		try {
			const params = {
				TableName: process.env.DYNAMO_TABLE_NAME as string,
				Key: {
					courseId: courseId,
				},
				AttributesToGet: ['session', 'question'],
			};

			const data = await this.client?.get(params).promise();

			if (!data || !data.Item) {
				throw 'Course Not Found';
			}

			// validate session matches
			if (data.Item.session.id !== parseInt(sessionId)) {
				console.log(
					'User attempted to submit a response for a ' +
						'session not currently being presented'
				);
				return 0;
			}

			// validate question matches
			if (data.Item.question.id !== parseInt(questionId)) {
				console.log(
					'User attempted to submit a response for a ' +
						'question not currently being presented'
				);
				return 0;
			}

			// validate questionOptionId is part of the question
			const found = data.Item.question.QuestionOptions.some(
				(option: QuestionOption) => option.id === parseInt(questionOptionId)
			);

			if (!found) {
				console.log(
					'User attempted to submit a response ' +
						'using a questionOptionId that is not ' +
						'a QuestionOption of the current question'
				);
				return 0;
			}

			// all parameters check out
			return 1;
		} catch (error) {
			console.log('DynamoDB: error validating submit:');
			console.log(error);
			return 0;
		}
	}

	/******************************************************
	 * submit a users response, then notify the professor
	 * if it is not an updated response
	 *
	 * params
	 * - courseId, questionId, questionOptionId, userId, sessionId
	 * returns
	 * - list of connection id's as an array of strings
	 *****************************************************/
	public async submitResponse(
		courseId: string,
		questionId: string,
		questionOptionId: string,
		userId: string,
		sessionId: string
	): Promise<APIGatewayProxyResult> {
		console.log('attempting to submit');
		try {
			// first check that the student is trying to submit
			// for the current question/session
			const validated = await this.validateSubmit(
				courseId,
				questionId,
				questionOptionId,
				sessionId
			);

			if (!validated)
				throw 'Invalid params for the current question being presented';

			// attempt to create response in db
			await QuestionUserResponse.create({
				questionId: parseInt(questionId),
				userId: parseInt(userId),
				sessionId: parseInt(sessionId),
				questionOptionId: parseInt(questionOptionId),
			});

			// if successful, tell the professor a NEW response was recorded
			await this.sendToProfessor(courseId, 'studentSubmittedNew', {
				questionOptionId: questionOptionId,
			});

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
					// we have to get the users previous response
					// so that we can update it on the LTI side
					let prevQuestionOptionId = '';
					await QuestionUserResponse.findOne({
						where: {
							questionId: questionId,
							userId: userId,
							sessionId: sessionId,
						},
					})
						.then((prev) => {
							if (prev) {
								prevQuestionOptionId = String(prev.get().questionOptionId);
							}
						})
						.then(() => {
							QuestionUserResponse.update(
								{
									questionOptionId: parseInt(questionOptionId),
								},
								{
									returning: true,
									where: {
										questionId: questionId,
										userId: userId,
										sessionId: sessionId,
									},
								}
							);
						});

					this.sendToProfessor(courseId, 'studentSubmittedUpdate', {
						previous: prevQuestionOptionId,
						new: questionOptionId,
					});

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
	private async getConnections(courseId: string): Promise<string[]> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			AttributesToGet: ['connections'],
		};

		const data = await this.client?.get(params).promise();

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
	public async startQuestion(
		courseId: string,
		question: Question
	): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			UpdateExpression: 'SET question = :q',
			ExpressionAttributeValues: {
				':q': question,
			},
			ConditionExpression: 'attribute_exists(courseId)',
		};

		try {
			// first set questionOpen to true for the room
			await this.client?.update(params).promise();

			// then publish the question to all students
			await this.publishAll(courseId, 'startQuestion', question);

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
	public async endQuestion(courseId: string): Promise<APIGatewayProxyResult> {
		const params = {
			TableName: process.env.DYNAMO_TABLE_NAME as string,
			Key: {
				courseId: courseId,
			},
			UpdateExpression: 'SET question = :q',
			ExpressionAttributeValues: {
				':q': null,
			},
			ConditionExpression: 'attribute_exists(courseId)',
		};

		try {
			// first set questionOpen to false for the room
			await this.client?.update(params).promise();

			// then publish endQuestion to all students
			await this.publishAll(courseId, 'endQuestion');

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
	private async publishAll(
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

	/******************************************************
	 * Publish a message to a specific connection
	 * {
	 * 	action: an common action for the client to act on,
	 *  payload: associated data if relevant to the action
	 * }
	 *
	 * params
	 * - connectionId, action, payload (optional)
	 *
	 * returns
	 * - n/a
	 *****************************************************/
	private async publish(
		connectionId: string,
		action: string,
		payload?: unknown
	): Promise<void> {
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
			console.log(`error publishing to connection ${connectionId}`);
			console.log(e);
		}
	}
}

interface QuestionOption {
	id: number;
	createdAt: string;
	questionId: number;
	responseCount: number;
	text: string;
	isAnswer: boolean;
	updatedAt: string;
}

interface Question {
	question: string;
	correctnessPoints: number;
	responseCount: number;
	title: string;
	QuestionOptions: QuestionOption[];
	folderId: number;
	participationPoints: number;
	createdAt: string;
	isClosed: boolean;
	progress: number;
	id: number;
	courseId: string;
	updatedAt: string;
}
