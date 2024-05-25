import { Role } from '@/users/entities/role.entity'
import { User } from '@/users/entities/user.entity'
import { hash } from 'argon2'
import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'

export class UsersSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const connection = em.getConnection()
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0;')
    await connection.execute('TRUNCATE TABLE `role`;')
    await connection.execute('TRUNCATE TABLE `user`;')
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1;')

    const roleAdministrator = new Role()
    roleAdministrator.title = 'Administrator'
    roleAdministrator.scope = ['profile', 'roles', 'users', 'products', 'admin']
    await em.persist(roleAdministrator)

    const roleUser = new Role()
    roleUser.title = 'User'
    roleUser.scope = ['profile']
    await em.persist(roleUser)

    await em.flush()

    const userAdministrator = new User()
    userAdministrator.email = 'kundius.ruslan@gmail.com'
    userAdministrator.name = 'Administrator'
    userAdministrator.password = await hash('qwerty')
    userAdministrator.role = roleAdministrator
    await em.persist(userAdministrator)

    const userUser = new User()
    userUser.email = 'kundius.ruslan+1@gmail.com'
    userUser.name = 'User'
    userUser.password = await hash('qwerty')
    userUser.role = roleUser
    await em.persist(userUser)

    await em.flush()
  }
}
