import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { useContainer } from 'class-validator';
import { AppModule } from './../src/app.module';
import { PetEnum } from 'src/enums/petEnum';
import { PetSize } from 'src/enums/pet-size.enum';
import { PetAge } from 'src/enums/pet-age.enum';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

describe('Find a Friend API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let petId: string;
  const uniqueId = Date.now().toString();
  const orgEmail = `org_${uniqueId}@test.com`;
  const cityE2E = `City_${uniqueId}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Users
  it('/users (POST) - Deve criar uma ORG', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'ORG Test E2E',
        email: orgEmail,
        password: 'password123',
        address: 'Rua das Flores, 123',
        city: cityE2E,
        state: 'SP',
        zipCode: '12345-678',
        whatsapp: '5511999999999',
      });
    if (response.status !== 201) console.log('POST /users error:', response.body);
    expect(response.status).toBe(201);
  });

  // Auth
  it('/auth/login (POST) - Deve logar com a ORG criada', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: orgEmail,
        password: 'password123',
      })
      .expect(201);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
    accessToken = response.body.access_token;
    refreshToken = response.body.refresh_token;
  });

  it('/auth/refresh (POST) - Deve renovar o token com o refresh_token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refresh_token: refreshToken })
      .expect(201);

    expect(response.body.access_token).toBeDefined();
    accessToken = response.body.access_token; // Usa o novo access_token
  });

  // Pets
  it('/pets (POST) - Deve criar um pet', async () => {
    const response = await request(app.getHttpServer())
      .post('/pets')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Rex E2E',
        especie: PetEnum.DOG,
        size: PetSize.MEDIO,
        age: PetAge.ADULTO,
        description: 'Um cão muito amigável',
      })
      .expect(201);

    expect(response.body.pet.id).toBeDefined();
    petId = response.body.pet.id;
  });

  it('/pets (GET) - Deve falhar sem cidade', () => {
    return request(app.getHttpServer()).get('/pets').expect(400); // ValidationPipe (Bad Request)
  });

  it('/pets (GET) - Deve buscar pets pela cidade e conter o pet criado', async () => {
    const response = await request(app.getHttpServer())
      .get(`/pets?city=${cityE2E}`)
      .expect(200);

    const pets = response.body.data;
    expect(pets.length).toBeGreaterThan(0);
    const petFound = pets.find((p: any) => p.name === 'Rex E2E');
    expect(petFound).toBeDefined();
    expect(petFound.status).toBe('available');
  });

  it('/pets/:id (GET) - Deve retornar detalhes do pet com dados da ORG', async () => {
    const response = await request(app.getHttpServer())
      .get(`/pets/${petId}`)
      .expect(200);

    expect(response.body.id).toEqual(petId);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.password).toBeUndefined(); // a senha não deve ser retornada
    expect(response.body.user.whatsapp).toBe('5511999999999');
  });

  it('/pets/:id (PUT) - Deve atualizar os dados do pet sendo o dono', async () => {
    await request(app.getHttpServer())
      .put(`/pets/${petId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Rex E2E Updated',
      })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get(`/pets/${petId}`)
      .expect(200);

    expect(response.body.name).toEqual('Rex E2E Updated');
  });

  it('/pets/:id/contact (GET) - Deve retornar os dados de contato corretamente', async () => {
    const response = await request(app.getHttpServer())
      .get(`/pets/${petId}/contact`)
      .expect(200);

    expect(response.body.whatsapp).toBe('5511999999999');
    expect(response.body.link).toBe('https://wa.me/5511999999999');
  });

  // Logout e Refresh inválido
  it('/auth/logout (POST) - Deve deslogar a ORG', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
  });

  it('/auth/refresh (POST) - Deve falhar 401 usando o refresh_token antigo limpo', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refresh_token: refreshToken })
      .expect(401);
  });
});
