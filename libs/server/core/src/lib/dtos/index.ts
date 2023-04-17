import { ApiProperty } from '@nestjs/swagger';

export class Result {
  constructor(public success: boolean, public message?: string) {}

  static success(message?: string) {
    return new Result(true, message);
  }

  static failure(message?: string) {
    return new Result(false, message);
  }
}

export class ResponseResult {
  @ApiProperty()
  public success: boolean;
  @ApiProperty()
  public message: string;
  @ApiProperty()
  public data?: any;

  static success(message: string, data?: any) {
    return {
      success: true,
      message,
      data,
    } as ResponseResult;
  }

  static fail(message: string, data?: any) {
    return {
      success: false,
      message,
      data,
    } as ResponseResult;
  }
}
