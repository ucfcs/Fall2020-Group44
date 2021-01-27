import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
const Folder = require('../model/Folder')
const querystring = require('querystring')

const mockUserid = 1
const mockCourseId = 1

const getFolder = async (event?: APIGatewayEvent): Promise<ProxyResult> => {
    return Folder.findAll({
        where: {
            userId: mockUserid,
            courseId: event?.queryStringParameters?.courseId,
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

    return Folder.create({
        name: body?.name,
        userId: mockUserid,
        courseId: body?.courseId,
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

    return Folder.update({ name: body.name }, { where: { id: body.folderId } })
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
    const body = querystring.parse(event?.body)

    return Folder.destroy({ where: { id: body.folderId } })
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
