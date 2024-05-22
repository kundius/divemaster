import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Role } from '@/users/entities/role.entity'

export default class UsersSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;')
    await dataSource.query('TRUNCATE TABLE `role`;')
    await dataSource.query('TRUNCATE TABLE `user`;')
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;')

    const roleRepository = dataSource.getRepository(Role)
    const userRepository = dataSource.getRepository(User)

    const roleAdministrator = new Role()
    roleAdministrator.title = 'Administrator'
    roleAdministrator.scope = ['profile', 'roles', 'users', 'products', 'admin']

    const roleUser = new Role()
    roleUser.title = 'User'
    roleUser.scope = ['profile']

    await roleRepository.save(roleAdministrator)
    await roleRepository.save(roleUser)

    const userAdministrator = new User()
    userAdministrator.email = 'kundius.ruslan@gmail.com'
    userAdministrator.name = 'Administrator'
    userAdministrator.password = 'qwerty'
    userAdministrator.role = roleAdministrator

    const userUser = new User()
    userUser.email = 'kundius.ruslan+1@gmail.com'
    userUser.name = 'User'
    userUser.password = 'qwerty'
    userUser.role = roleUser

    await userRepository.save(userAdministrator)
    await userRepository.save(userUser)
  }
}
