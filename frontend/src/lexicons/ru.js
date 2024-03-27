export default {
  project: 'Vesp',
  greetings: {
    title: 'Добро пожаловать!',
    message: 'Выберите пункт меню для начала работы',
  },
  actions: {
    cancel: 'Отмена',
    create: 'Добавить',
    save: 'Сохранить',
    upload: 'Загрузить',
  },
  security: {
    username: 'Логин',
    password: 'Пароль',
    login: 'Вход',
    logout: 'Выход',
    greetings: 'Привет!',
    goodbye: 'Пока, пока...',
    profile: 'Профиль',
    success_update_message: 'Ваш профиль был успешно обновлён!',
  },
  models: {
    user: {
      title_one: 'Пользователь',
      title_many: 'Пользователи',
      id: 'Id',
      username: 'Логин',
      fullname: 'Полное имя',
      password: 'Пароль',
      email: 'Email',
      active: 'Активно',
      role: 'Группа',
      created_at: 'Дата создания',
    },
    user_role: {
      title_one: 'Группа',
      title_many: 'Группы',
      id: 'Id',
      title: 'Название',
      scope: 'Разрешения',
      add_scope: 'Добавить',
      users: 'Пользователи',
    },
    category: {
      add: 'Добавить категорию',
      title_one: 'Категория',
      title_many: 'Категории',
      id: 'Id',
      title: 'Название',
      description: 'Описание',
      active: 'Активна',
    },
    product: {
      add: 'Добавить товар',
      title_one: 'Товар',
      title_many: 'Товары',
      id: 'Id',
      title: 'Название',
      description: 'Описание',
      sku: 'Артикул',
      price: 'Цена',
      active: 'Активен',
      category_id: 'Категория',
      category: 'Категория',
    },
  },
  pages: {
    admin: {
      title: 'Админка',
      users: 'Пользователи',
      user_roles: 'Группы',
    },
    user: {
      title: 'Пользователь',
      profile: 'Профиль',
    },
  },
  success: {
    default: 'Сохранено',
    login: 'Добро пожаловать!',
    logout: 'До свидания...',
    profile: 'Профиль успешно сохранён',
    user_role: {
      create: 'Группа успешно добавлена',
      update: 'Группа успешно изменеа',
      delete: 'Группа успешно удалена'
    }
  },
  errors: {
    default: 'Возникла ошибка',
    security: {
      inactive: 'Ваш аккаунт неактивен',
      wrong: 'Неправильное имя или пароль',
    },
  },
}
