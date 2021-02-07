import { APIGatewayEvent, ProxyResult } from 'aws-lambda'
import querystring from 'querystring'
import PollOption from '../model/PollOption'
import responses from './API_Responses'

const mockUserid = 1

// POST /api/v1/poll_option
const create = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const body = querystring.parse(event?.body || '')
    const params = event?.queryStringParameters

    if (!params?.pollId) {
        return responses._400({ message: 'Missing pollId parameter' })
    }

    try {
        const result = await PollOption.create({
            text: body?.text,
            isAnswer: body?.isAnswer,
            pollId: params?.pollId,
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

// PUT /api/v1/poll_option
const update = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const body = querystring.parse(event?.body || '')
    const params = event?.queryStringParameters

    if (!params?.pollOptionId) {
        return responses._400({ message: 'Missing pollOptionId parameter' })
    }

    try {
        await PollOption.update(
            { text: body?.text, isAnswer: body?.isAnswer },
            { where: { id: params?.pollOptionId } }
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

// DELETE /api/v1/poll_option
const remove = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const params = event?.queryStringParameters

    if (!params?.pollOptionId) {
        return responses._400({ message: 'Missing pollOptionId parameter' })
    }

    try {
        await PollOption.destroy({ where: { id: params?.pollOptionId } })

        return responses._200({
            message: 'Success',
        })
    } catch (error) {
        return responses._400({
            message: error.name || 'Fail to create',
        })
    }
}

export { create, update, remove }
