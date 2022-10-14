import { GetMetricDataCommand, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";

class CloudWatch {
    constructor(cloudWatchClient) {
        this.cloudWatchClient = cloudWatchClient
    }

    async putInMetric() {

        const input = {
            MetricData: [{
                MetricName: 'writes',
                Unit: 'Count',
                Value: 1

            }],
            Namespace: 'writes'

        }
        const command = new PutMetricDataCommand(input);
        await this.cloudWatchClient.send(command);
    }
    async putOutMetric() {

      const input = {
          MetricData: [{
              MetricName: 'deletes',
              Unit: 'Count',
              Value: 1

          }],
          Namespace: 'deletes'

      }
      const command = new PutMetricDataCommand(input);
      await this.cloudWatchClient.send(command);
  }
    async getMetricInDay(metric) {

        const date = new Date()
        const minutes = 1440
        const dateBefore = new Date(date.getTime() - minutes * 60000);

        const input = {
            
                EndTime: date,
                MetricDataQueries: [
                  {
                    Id: metric,
                    Label: 'inserts in 24h',
                    MetricStat: {
                      Metric: {
                      
                        MetricName: metric,
                        Namespace: metric
                      },
                      Period: 300,
                      Stat: 'Sum',
                      Unit: 'Count'
                    },
                  },
                ],
                StartTime: dateBefore,
        }
        const command = new GetMetricDataCommand(input);
        return await this.cloudWatchClient.send(command);
    }
    async getMetricInHour(metric) {

      const date = new Date()
      const minutes = 60
      const dateBefore = new Date(date.getTime() - minutes * 60000);

      const input = {
          
              EndTime: date,
              MetricDataQueries: [
                {
                  Id: metric,
                  Label: 'inserts in last hour',
                  MetricStat: {
                    Metric: {
                    
                      MetricName: metric,
                      Namespace: metric
                    },
                    Period: 300,
                    Stat: 'Sum',
                    Unit: 'Count'
                  },
                },
              ],
              StartTime: dateBefore,
      }
      const command = new GetMetricDataCommand(input);
      return await this.cloudWatchClient.send(command);
  }
  async getMetricOutHour(metric) {

    const date = new Date()
    const minutes = 60
    const dateBefore = new Date(date.getTime() - minutes * 60000);

    const input = {
        
            EndTime: date,
            MetricDataQueries: [
              {
                Id: metric,
                Label: 'deletes in last hour',
                MetricStat: {
                  Metric: {
                  
                    MetricName: metric,
                    Namespace: metric
                  },
                  Period: 300,
                  Stat: 'Sum',
                  Unit: 'Count'
                },
              },
            ],
            StartTime: dateBefore,
    }
    const command = new GetMetricDataCommand(input);
    return await this.cloudWatchClient.send(command);
}

  async getMetricOutDay(metric) {

    const date = new Date()
    const minutes = 1440
    const dateBefore = new Date(date.getTime() - minutes * 60000);

    const input = {
        
            EndTime: date,
            MetricDataQueries: [
              {
                Id: metric,
                Label: 'deletes in 24h',
                MetricStat: {
                  Metric: {
                  
                    MetricName: metric,
                    Namespace: metric
                  },
                  Period: 300,
                  Stat: 'Sum',
                  Unit: 'Count'
                },
              },
            ],
            StartTime: dateBefore,
    }
    const command = new GetMetricDataCommand(input);
    return await this.cloudWatchClient.send(command);
}
}
export default CloudWatch