import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) should reject invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrong123',
      })
      .expect(401);
  });

  it('/auth/register (POST) should reject invalid email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        fullName: 'Test',
        email: 'not-an-email',
        password: '123456',
      })
      .expect(400);
  });
});