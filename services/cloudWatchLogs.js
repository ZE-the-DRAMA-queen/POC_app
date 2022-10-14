import { CreateLogGroupCommand, CreateLogStreamCommand, DeleteLogGroupCommand, DescribeLogGroupsCommand, PutLogEventsCommand, GetLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import { appEnum } from '../models/utility_enum.js'

class CloudWatchLogs {
    constructor(cloudWatchLogsClient) {
        this.cloudWatchLogsClient = cloudWatchLogsClient
        this.logGroupName = appEnum.LOG_GROUP_NAME
        this.logStreamName = appEnum.LOG_STREAM_NAME
        this.sequenceToken
    }

    async createLogGroup() {


        const describeInput = {
            logGroupNamePrefix: this.logGroupName
        }
        const describeCommand = new DescribeLogGroupsCommand(describeInput)
        const logGroup = await this.cloudWatchLogsClient.send(describeCommand)

        if (logGroup.logGroups[0].logGroupName === this.logGroupName) {

            const deleteInput = {
                logGroupName: this.logGroupName
            }

            const deleteCommand = new DeleteLogGroupCommand(deleteInput)
            await this.cloudWatchLogsClient.send(deleteCommand)
        }

        const input = {
            logGroupName: this.logGroupName,
            tags: { S: appEnum.LOG_GROUP_TAG }
        }
        const createGroupCommand = new CreateLogGroupCommand(input)
        await this.cloudWatchLogsClient.send(createGroupCommand)

    }

    async createLogStream() {
        const input = {
            logGroupName: this.logGroupName,
            logStreamName: this.logStreamName
        }
        const createStreamcommand = new CreateLogStreamCommand(input)
        await this.cloudWatchLogsClient.send(createStreamcommand)


    }

    async sendLog(message) {
        const input = {
            logEvents: [{
                message: message,
                timestamp: Date.now()
            }
            ],
            logGroupName: this.logGroupName,
            logStreamName: this.logStreamName,
            sequenceToken: this.sequenceToken

        }
        const logCommand = new PutLogEventsCommand(input)
        const response = await this.cloudWatchLogsClient.send(logCommand)
        this.sequenceToken = response.nextSequenceToken

    }
    async retrieveLogs() {

        const date = Date.now()
        const miliseconds = 1000
        const minutes = 1440
        const dateBefore = date - (minutes * miliseconds)
        const input = {
            endTime: date,
            logGroupName: appEnum.LOG_GROUP_NAME,
            logStreamName: appEnum.LOG_STREAM_NAME,
            startTime: dateBefore

        }
        const logCommand = new GetLogEventsCommand(input)
        const response = await this.cloudWatchLogsClient.send(logCommand)
        console.log(response)
        return response
    }

}
export default CloudWatchLogs