import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument} from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodosAcess {
    constructor(
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB),
        todosTable = process.env.TODOS_TABLE,
        todosIndex = process.env.TODOS_CREATED_AT_INDEX
    )
    {
        this.documentClient = DynamoDBDocument.from(documentClient)
        this.todosTable = todosTable
        this.todosIndex = todosIndex
    }

    async getAllTodos(userId){
        const result = await this.documentClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        return result.Items
    }

    async createTodo(todoItem){
        await this.documentClient.put({
            TableName: this.todosTable,
            Item: todoItem
        })
        return todoItem
    }
    
    async updateTodo(userId, todoId, todoUpdate){
        const result = await this.documentClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            }
        })
    }

    async deleteTodo(userId, todoId){
        await this.documentClient.delete({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        })
    }

    async updateTodoAttachmentUrl(userId, todoId, attachmentUrl){
        await this.documentClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            }
        })
    }
}