const AWS = require('aws-sdk')
const redis = require('async-redis')
// import redis from "redis";

export class Connection {
  constructor (params = {}) {
    this.host = params.host
    this.port = parseInt(params.port)
    // this.password = params.password
  }

  init (event) {
		console.log('init')

    this.client = redis.createClient({
      host: this.host,
      port: this.port,
      // password: this.password
    })

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
   * - success of redis operation SADD
   *****************************************************/
  addStudent (key, connectionId) {
		return this.client.sadd(key, connectionId)
  }

  /******************************************************
   * add professor to separate key 'courseId-prof'
   * this is done for fast professor lookup in case
   * they disconnect before closing session
   * params
   * - key: roomId == courseId
   * - connectionId: websocket connectionId of student
   * returns
   * - success of redis operation ADD
   *****************************************************/
  addProfessor (key, connectionId) {
    return this.client.add(`${key}-prof`, connectionId)
  }

  /******************************************************
   * deleting a room from redis requires deleting both
   * the professor key and student set key
   * params
   * - key: roomId == courseId
   * returns
   * - success of both redis operations DEL
   *****************************************************/
  deleteRoom (key) {
    return (
      this.client.del(`${key}-prof`)
      && this.client.del(key)
    )
  }

  /******************************************************
   * check if room key exists
   * params
   * - key: roomId == courseId
   * returns
   * - 1 if room exists, 0 otherwise
   *****************************************************/
  roomExists (key) {
    return this.client.exists(key)
  }

  /******************************************************
   * remove student connectionId from room set on disconnect
   * params
   * - key: roomId == courseId
   * - connectionId: websocket connectionId of student
   * returns
   * - success of redis operation SREM
   *****************************************************/
  removeStudent (key, connectionId) {
    return this.client.srem(key, connectionId)
  }

  /******************************************************
   * get all students in a room
   * params
   * - key: roomId == courseId
   * returns
   * - All connectionIds in the student set
   *****************************************************/
  getStudents (key) {
    return this.client.smembers(key)
  }

  /******************************************************
   * publish message to all students in a room
   * params
   * - key: roomId == courseId
   * - message: data to send
   *****************************************************/
  async publish (key, message) {
		const connections = await this.getStudents(key)
		
		console.log("connections:")
		console.log(connections)

    for (const connectionId of connections) {
      // console.log(connectionId)
      if (event.requestContext.connectionId === connectionId) continue
      try {
        await this.gateway.postToConnection({ ConnectionId: connectionId, Data: message }).promise()
      } catch (e) {
        this.removeStudent(key, connectionId)
        console.log(e)
      }
    }
  }
}