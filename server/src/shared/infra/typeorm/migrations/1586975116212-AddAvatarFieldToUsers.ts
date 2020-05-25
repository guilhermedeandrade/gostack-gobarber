import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

class AddAvatarFieldToUsers1586975116212 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({ name: 'avatar', type: 'varchar', isNullable: true }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'avatar')
  }
}

export default AddAvatarFieldToUsers1586975116212
