import { APIGatewayEvent, ProxyResult } from 'aws-lambda'
import querystring from 'querystring'
import Poll from '../model/Poll'
import PollQuestion from '../model/PollQuestion'
import responses from './API_Responses'

const mockUserid = 1

// GET /api/v1/poll
const get = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const params = event?.queryStringParameters

    if (!params?.pollId) {
        return responses._400({ message: 'Missing parameters' })
    }

    try {
        const [poll, questions] = await Promise.all([
            Poll.findOne({
                where: {
                    id: params?.pollId,
                    userId: mockUserid,
                },
            }),
            Poll.findAll({
                where: {
                    pollId: params?.pollId,
                },
            }),
        ])

        return responses._200({
            poll: {
                ...poll,
                questions,
            },
        })
    } catch (error) {
        return responses._400({
            message: error.name || 'Fail to query',
        })
    }
}

// POST /api/v1/poll
const create = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const body = querystring.parse(event?.body || '')
    const params = event?.queryStringParameters

    if (!params?.folderId) {
        return responses._400({ message: 'Missing folderId parameter' })
    }
    if (!params?.courseId) {
        return responses._400({ message: 'Missing courseId parameter' })
    }

    try {
        const result = await Poll.create({
            name: body?.name,
            folderId: params?.folderId,
            courseId: params?.courseId,
            userId: mockUserid,
        })

        return responses._200({
            message: 'Success',
            data: result,
        })
    } catch (error) {
        return responses._400({
            message: error.name || 'Fail to create',
        })
    }
}

// PUT /api/v1/poll
const update = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const body = querystring.parse(event?.body || '')
    const params = event?.queryStringParameters

    if (!params?.pollId) {
        return responses._400({ message: 'Missing pollId parameter' })
    }

    try {
        await Poll.update(
            { name: body.name },
            { where: { id: params?.pollId } }
        )
        return responses._200({
            message: 'Success',
        })
    } catch (error) {
        return responses._400({
            message: error.name || 'Fail to update',
        })
    }
}

// DELETE /api/v1/poll
const remove = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const params = event?.queryStringParameters

    if (!params?.pollId) {
        return responses._400({ message: 'Missing pollId parameter' })
    }

    try {
        await Poll.destroy({ where: { id: params?.pollId } })
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
            }),
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: error.name || 'Fail to create',
            }),
        }
    }
}

export { get, create, update, remove }
