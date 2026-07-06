import { MigrationInterface, QueryRunner } from 'typeorm';

export class pruebaFinal1783147479661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "cover_image" TYPE character varying(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "cover_image" TYPE character varying(800)`,
    );
  }
}
