class DevLogger{
    
    constructor(cloudWatchLogs){
        this.cloudWatchLogs=cloudWatchLogs
    }

    async sendLog(message){
        await this.cloudWatchLogs.sendLog(message)
    }
    async retrieveLog(){
        console.log(this.cloudWatchLogs)
       return await this.cloudWatchLogs.retrieveLogs()
    }

}
export default DevLogger