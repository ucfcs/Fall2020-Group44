import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
const Folder = require('../model/Folder')
const querystring = require('querystring')

const mockUserid = 1

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

    await Folder.sync()
    return Folder.findAll({
        where: {
            userId: mockUserid,
            courseId: params?.courseId,
        },
    })
        .then((result: Array<Object>) => {
            return {
                status: 200,
                body: JSON.stringify({
                    folderList: result,
                }),
            }
        })
        .catch(() => {
            return {
                status: 400,
            }
        })
}

const newFolder = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const body = querystring.parse(event?.body)
    const params = event?.queryStringParameters

    if (!params?.courseId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing parameters',
            }),
        }
    }

    await Folder.sync()
    return Folder.create({
        name: body?.name,
        userId: mockUserid,
        courseId: params?.courseId,
    })
        .then(() => {
            return {
                status: 200,
            }
        })
        .catch(() => {
            return {
                status: 400,
            }
        })
}

const updateFolder = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    const body = querystring.parse(event?.body)
    const params = event?.queryStringParameters

    if (!params?.folderId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing parameters',
            }),
        }
    }

    await Folder.sync()
    return Folder.update(
        { name: body.name },
        { where: { id: params?.folderId } }
    )
        .then(() => {
            return {
                status: 200,
            }
        })
        .catch(() => {
            return {
                status: 400,
            }
        })
}

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
    await Folder.sync()
    return Folder.destroy({ where: { id: params?.folderId } })
        .then(() => {
            return {
                status: 200,
            }
        })
        .catch(() => {
            return {
                status: 400,
            }
        })
}

export { getFolder, newFolder, updateFolder, deleteFolder }
