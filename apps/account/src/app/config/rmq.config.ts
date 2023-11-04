import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => {
      return {
        exchangeName: configService.get('AMQP_EXCHANGE', ''),
        connections: [{
          login: configService.get('AMQP_USER', ''),
          password: configService.get('AMQP_PASSWORD', ''),
          host: configService.get('AMQP_HOST', ''),
        }],
        queueName: configService.get('AMQP_QUEUE', ''),
        prefetchCount: Number(configService.get('AMQP_PREFETCH_COUNT', 0)),
        serviceName: configService.get('SERVICE_NAME', 'policy-account'),
      }
    },
    inject: [ConfigService],
    imports: [ConfigModule],
  }
}
