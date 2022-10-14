import express from 'express';
import { Repo } from '../app.js'
import { Logger } from '../app.js'
import { cloudWatch } from '../app.js'
import { error } from '../models/error.js'

const DevRouter = express.Router()

DevRouter.get('/new', (req, res) => {
    res.render('new')
})

//add a new dev to dynamo 
DevRouter.post('/', async (req, res) => {
    const regExpression = /^[a-zA-Z]+ [a-zA-Z]+$/
    const regEmailExpression = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    const isValidName = regExpression.test(req.body.name)
    const isValidEmail = regEmailExpression.test(req.body.email)

    if (!isValidName && !isValidEmail) {
        res.render('error', { message: 'Please enter your first and last name separated by a space and a valid email' })
        await Logger.sendLog(error.INVALID_NAME_OR_EMAIL)
    }
    else if (!isValidName) {
        res.render('error', { message: 'Please enter your first and last name separated by a space' })
        await Logger.sendLog(error.INVALID_NAME)
    }
    else if (!isValidEmail) {
        res.render('error', { message: 'Please enter a valid email' })
        await Logger.sendLog(error.INVALID_EMAIL)
    }
    else {
        try {
            await Repo.addDev(req.body.name, req.body.email, req.body.job)
            cloudWatch.putInMetric()
            res.redirect('/')
        } catch (e) {
            await Logger.sendLog(error.INVALID_ADD_MEMBER.replace('$name',req.body.name))
            res.render('error', { message: error.INVALID_ADD_MEMBER.replace('$name',req.body.name) })
        }
    }
})

DevRouter.get('/edit/:id', async (req, res) => {
    const dev = await Repo.getDev(req.params.id.toString())
    res.render('edit', { dev: dev })
})

DevRouter.post('/edit/:id', async (req, res) => {
    await Repo.updateDev(req.body.id, req.body.name, req.body.email)
    res.redirect('/')
})


DevRouter.post('/:id', async (req, res) => {

    try {
        await Repo.deleteDev(req.params.id)
        cloudWatch.putOutMetric()
        res.redirect('/')
    } catch (e) {
        await Logger.sendLog(error.INVALID_DELETE)
        res.render('error', { message: error.INVALID_DELETE })
    }
})


DevRouter.get('/:id', async (req, res) => {
    const dev = await Repo.getDev(req.params.id.toString())
    res.render('dev', { dev: dev })
})

DevRouter.get('/dynamo/stats', async (req, res) => {
    const insInDay = await cloudWatch.getMetricInDay('writes');
    let insDay;
    if(insInDay.MetricDataResults[0].Values.length==0){
        insDay=0
    }else{
        insDay = insInDay.MetricDataResults[0].Values.reduce((sum,i)=>{return sum+i})
    }

    const insInHour = await cloudWatch.getMetricInHour('writes');
    console.log(insInHour)
    let insHour;
    if(insInHour.MetricDataResults[0].Values.length==0){
        insHour=0
    }else{
        insHour = insInHour.MetricDataResults[0].Values.reduce((sum,i)=>{return sum+i})
    }

    const outsInHour = await cloudWatch.getMetricOutHour('deletes');
    let outsHour;
    if(outsInHour.MetricDataResults[0].Values.length==0){
        outsHour=0
    }else{
        outsHour = outsInHour.MetricDataResults[0].Values.reduce((sum,i)=>{return sum+i})
    }

    const outsInDay = await cloudWatch.getMetricOutDay('deletes');
    let outsDay;
    if(outsInDay.MetricDataResults[0].Values.length==0){
        outsDay=0
    }else{
        outsDay = outsInDay.MetricDataResults[0].Values.reduce((sum,i)=>{return sum+i})
    }
 
    const value = {
        insDay:insDay,
        insHour:insHour,
        outsDay:outsDay,
        outsHour:outsHour
    }
    res.render('dynamo', { value: value })

})
export default DevRouter