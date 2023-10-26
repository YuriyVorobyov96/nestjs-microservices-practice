import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt";

export const getJWTConfig = (): JwtModuleAsyncOptions => ({
  useFactory: (ConfigService: ConfigService) => ({
    secret: ConfigService.get('JWT_SECRET'),
  }),
  imports: [ConfigModule],
  inject: [ConfigService],
});
