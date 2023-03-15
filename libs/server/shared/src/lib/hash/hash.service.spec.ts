import { HashService } from './hash.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a string', async () => {
    const hash = await service.hashAsync('test');
    expect(hash).toBeDefined();
    expect(hash).not.toEqual('test');
  });

  it('should compare a string', async () => {
    const hash = await service.hashAsync('test');
    const result = await service.compareAsync('test', hash);
    expect(result).toBe(true);
  });

  it('should compare a string', async () => {
    const hash = await service.hashAsync('test');
    const result = await service.compareAsync('test2', hash);
    expect(result).toBe(false);
  });

  it('should throw an error when plain text is null or empty', async () => {
    try {
      await service.hashAsync('');
      fail('Should have thrown an error');
    } catch (e) {
      expect(e.message).toBe('Plain text cannot be null or empty');
    }
  });

  it('should throw an error when hash is null or empty', async () => {
    try {
      await service.compareAsync('test', '');
      fail('Should have thrown an error');
    } catch (e) {
      expect(e.message).toBe('Hash cannot be null or empty');
    }
  });

  it('should throw an error when plain text is null or empty', async () => {
    try {
      await service.compareAsync('', 'test');
      fail('Should have thrown an error');
    } catch (e) {
      expect(e.message).toBe('Plain text cannot be null or empty');
    }
  });
});
