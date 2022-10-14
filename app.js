import express from 'express';
import dotenv from 'dotenv';
import {config} from './aws.config/aws.config.js'
import Dynamo from './services/dynamo.js'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import DevRouter from './routes/dev.router.js'
import DevRepo from './services/Repo.js'
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import CloudWatchLogs from './services/cloudWatchLogs.js'
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import DevLogger from './services/logger.js'
import CloudWatch from './services/cloudWatch.js'



dotenv.config();

const dynamoClient = new DynamoDBClient(config)
const cloudWatchClient = new CloudWatchClient(config)
const cloudWatchLogsClient= new CloudWatchLogsClient(config)

const dynamo= new Dynamo(dynamoClient)
const cloudWatchLogs= new CloudWatchLogs(cloudWatchLogsClient)
const cloudWatch = new CloudWatch(cloudWatchClient)

const Logger= new DevLogger(cloudWatchLogs)
const Repo= new DevRepo(dynamo,cloudWatch)


await cloudWatchLogs.createLogGroup()
await cloudWatchLogs.createLogStream()


const app = express()

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use('/devs',DevRouter)

app.get('/', async (req, res) => {
  const team= await Repo.getDevTeam();
    res.render('index', {team:team})
})

app.listen(process.env.PORT)

export {Repo,Logger,cloudWatch}