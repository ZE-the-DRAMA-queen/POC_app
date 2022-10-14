import { ScanCommand, GetItemCommand, PutItemCommand, DeleteItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

import dotenv from 'dotenv';

dotenv.config();

class Dynamo {

    constructor(dynamoClient) {
        this.dynamoClient = dynamoClient
    }

    //get all items

    async getTeam() {
        const input = {
            TableName: process.env.TABLE_NAME,
            AttributesToGet: ['id', 'name', 'email', 'job']
        }
        const scanCommand = new ScanCommand(input)
        const response = await this.dynamoClient.send(scanCommand)
        return response.Items
    }

    //get one item by id

    async getTeamMember(id) {
        const input = {
            AttributesToGet: ['id', 'name', 'email', 'job'],
            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: id },
                role: { S: process.env.SECOND_KEY }
            }
        }
        const getCommand = new GetItemCommand(input)
        const response = await this.dynamoClient.send(getCommand)
        return response.Item
    }

    //add one item with name and email

    async addTeamMember(id, name, email, job) {
        const input = {
            AttributesToGet: ['name', 'email', 'job'],
            TableName: process.env.TABLE_NAME,
            Item: {
                id: { S: id },
                role: { S: process.env.SECOND_KEY },
                name: { S: name },
                email: { S: email },
                job: { S: job }
            }
        }
        const putCommand = new PutItemCommand(input)
        await this.dynamoClient.send(putCommand)


    }

    //delete one item by id

    async deleteTeamMember(id) {
        const input = {
            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: id },
                role: { S: process.env.SECOND_KEY }
            }
        }
        const deleteCommand = new DeleteItemCommand(input);
        await this.dynamoClient.send(deleteCommand)
    }

    // update one item by id

    async updateTeamMember(id, newName, newEmail) {
        const input = {

            TableName: process.env.TABLE_NAME,
            Key: {
                id: { S: id },
                role: { S: process.env.SECOND_KEY }
            },
            AttributeUpdates: {
                "name": {
                    Action: "PUT",
                    Value: { S: newName }
                },
                "email": {
                    Action: "PUT",
                    Value: { S: newEmail }
                }
            }
        }
        const updateCommand = new UpdateItemCommand(input);
        await this.dynamoClient.send(updateCommand)
    }
}
export default Dynamo