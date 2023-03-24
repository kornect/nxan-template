import { Test, TestingModule } from '@nestjs/testing';

import { OTP_OPTIONS, OtpOptions } from './otp.options';
import { OtpService } from './otp.service';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: OTP_OPTIONS,
          useValue: Object.assign(new OtpOptions(), {
            length: 6,
          }),
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a code', async () => {
    const code = await service.generateAsync();
    expect(code).toBeDefined();
    expect(code.length).toBe(6);
  });

  it('should generate a unique code every time', async () => {
    const code1 = await service.generateAsync();
    const code2 = await service.generateAsync();
    expect(code1).not.toEqual(code2);
  });
});
