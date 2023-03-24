import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MikroOrmHealthIndicator
} from '@nestjs/terminus';
import { AllowAnonymous } from '@nxan/server/auth/public';



export class HealthCheckResponse implements HealthCheckResult {
  @ApiProperty({ enum: ['error', 'ok', 'shutting_down'] })
  status: 'error' | 'ok' | 'shutting_down';
  @ApiProperty()
  info?: HealthIndicatorResult;
  @ApiProperty()
  error?: HealthIndicatorResult;
  @ApiProperty()
  details: HealthIndicatorResult;
}

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private health: HealthCheckService, private db: MikroOrmHealthIndicator) {
  }

  @Get('health')
  @AllowAnonymous()
  @ApiTags('health')
  @ApiOperation({ operationId: 'get-health', summary: 'Health check' })
  @ApiResponse({ type: HealthCheckResponse })
  @HealthCheck()
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
