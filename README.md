<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API

1. Clonar el repositorio

2. Instalar las depencias con el comando:

```
yarn install o npm install
```

3. Clonar el archivo `.env.template` y renombrarlo a `.env`

4. Cambiar las variables de entorno

5. Levantar la base de datos postgres

```
docker-compose up -d
```

6. Levantar el proyecto en modo de desarrollo con el comando:

```
yarn start:dev
```

7. Ejecutar SEED para llenar de información la BD ejecutando el siguiente enlace:

```
http://localhost:3000/api/seed
```

## Stack Usado

- NestJS
- Docker
- Postgres
