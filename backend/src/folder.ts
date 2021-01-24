import { APIGatewayEvent, Context, ProxyResult } from 'aws-lambda'
const Folder = require('../model/Folder')

const mockUserid = 1
const mockCourseId = 1

const getFolder = async (): Promise<ProxyResult> => {
    return Folder.findAll({
        where: {
            userId: mockUserid,
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
    let body
    if (event?.body) {
        body = JSON.parse(event.body)
    }

    return Folder.create({
        name: body.name,
        userId: mockUserid,
        courseId: mockCourseId,
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
    let body
    if (event?.body) {
        body = JSON.parse(event.body)
    }

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
    let body
    if (event?.body) {
        body = JSON.parse(event.body)
    }

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
