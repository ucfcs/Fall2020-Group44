import { APIGatewayEvent, ProxyResult } from 'aws-lambda'
import Folder from '../model/Folder'
import querystring from 'querystring'

const mockUserid = 1

// GET /api/v1/folder
const getFolder = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const params = event?.queryStringParameters

    if (!params?.courseId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing parameters',
            }),
        }
    }

    try {
        const result = await Folder.findAll({
            where: {
                userId: mockUserid,
                courseId: params?.courseId,
            },
        })

        return {
            statusCode: 200,
            body: JSON.stringify({
                folderList: result,
            }),
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: error.name || 'Fail to query',
            }),
        }
    }
}

// POST /api/v1/folder
const newFolder = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const body = querystring.parse(event?.body || '')
    const params = event?.queryStringParameters

    if (!params?.courseId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing parameters',
            }),
        }
    }

    try {
        const result = await Folder.create({
            name: body?.name,
            userId: mockUserid,
            courseId: params?.courseId,
        })

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
                data: result,
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

// PUT /api/v1/folder
const updateFolder = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const body = querystring.parse(event?.body || '')
    const params = event?.queryStringParameters

    if (!params?.folderId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing parameters',
            }),
        }
    }

    try {
        await Folder.update(
            { name: body.name },
            { where: { id: params?.folderId } }
        )
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
                message: error.name || 'Fail to update',
            }),
        }
    }
}

// DELETE /api/v1/folder
const deleteFolder = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const params = event?.queryStringParameters

    if (!params?.folderId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing parameters',
            }),
        }
    }

    try {
        await Folder.destroy({ where: { id: params?.folderId } })
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

export { getFolder, newFolder, updateFolder, deleteFolder }
