class DevRepo {

    constructor(Dynamo, cloudWatch) {
        this.Dynamo = Dynamo;
        this.id = 0;
        this.cloudWatch = cloudWatch
    }

    async getDevTeam() {
        return await this.Dynamo.getTeam()
    }

    async getDev(id) {
        return await this.Dynamo.getTeamMember(id)
    }

    async addDev(name, email, job) {

        const dev = await this.isThereADev(name)
        console.log(dev,'sss')
        if (!dev) {
            this.updateId()
            await this.Dynamo.addTeamMember(this.id.toString(), name, email, job)
            //await this.cloudWatch.putMetric()
        }
        else {
            throw new Error()
        }
    }

    async deleteDev(id) {
        const isDev = await this.isADev(id)
        if (!isDev){
            await this.Dynamo.deleteTeamMember(id)
        }
        else{
            throw new Error()
        }
    }

    async updateDev(id, newName, newEmail) {
        await this.Dynamo.updateTeamMember(id, newName, newEmail)
    }

    async isThereADev(name) {
        const devs = await this.getDevTeam()
        console.log(devs)
        if (devs.length != 0) {
            const dev = devs.find((developer) => {
                return developer.name.S.toUpperCase() == name.toUpperCase()
            })
            if (!dev) {
                return false
            }
            return true
        }
        return false
    }

    async isADev(id) {
        const dev = await this.getDev(id)
        if (dev.job.S.toUpperCase() != 'DEV') {
         return false
        }
        return true
    }

    updateId() {
        this.id++;
    }

}

export default DevRepo