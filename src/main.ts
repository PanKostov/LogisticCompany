import { NestFactory } from '@nestjs/core'
import { AppModule } from './AppModule'
import { ValidationPipe } from '@nestjs/common'
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  )
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000)
}
bootstrap()
