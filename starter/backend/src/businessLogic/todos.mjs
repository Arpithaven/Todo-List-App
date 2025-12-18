import { TodosAcess } from "../dataLayer/todosAccess.mjs";
import { AttachmentUtils } from "../fileStorage/attachmentUtils.mjs";
import { v4 as uuid } from 'uuid'; 
import { createLogger } from "../utils/logger.mjs";

const logger = createLogger('todos')
const todosAccess = new TodosAcess()
const attachmentUtils = new AttachmentUtils()

export async function getTodosForUser(userId){
    logger.info(`getting todos for ${userId}`)

    return todosAccess.getAllTodos(userId)
}

export async function createTodo(newTodo, userId){
    const todoId = uuid()
    const createdAt = new Date().toISOString()

    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        // attachmentUrl: null, // removed to fix bug where fetching todos fails due to null attachment field (it expects string)
        ...newTodo
    }

    logger.info(`creating new todo for ${userId}`, newItem)

    return await todosAccess.createTodo(newItem)
}

export async function updateTodo(userId, todoId, updatedTodo){
    logger.info(`updating todo ${todoId} for user ${userId}`, updatedTodo)

    return await todosAccess.updateTodo(userId, todoId, updatedTodo)
}

export async function deleteTodo(userId, todoId){
    logger.info(`deleting todo ${todoId} for user ${userId}`)

    return await todosAccess.deleteTodo(userId, todoId)
}

export async function createAttachmentPresignedUrl(userId, todoId){
    logger.info(`creating attachment url for todo ${todoId} for user ${userId}`)
    const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    await todosAccess.updateTodoAttachmentUrl(userId, todoId, attachmentUrl)
    return await attachmentUtils.getUploadUrl(todoId)
}