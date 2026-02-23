import { NestFactory } from "@nestjs/core";
import { CommandFactory } from "nest-commander";
import { Command } from "./command.module";
import { DataSource } from "typeorm";

async function bootstrap() {

  await CommandFactory.runWithoutClosing(Command, {
    logger: ['warn', 'error'],
  });
}
bootstrap();
