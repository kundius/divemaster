<?php

namespace App\Controllers\Web;

use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Vesp\Controllers\ModelController;

class Categories extends ModelController
{
  protected $model = Category::class;
  // При выводе 1 модели обязательно проверяем её статус
  protected function beforeGet(Builder $c): Builder
  {
    $c->where('active', true);

    return $c;
  }

  // При выводе списка моделей делаем то же самое
  protected function beforeCount(Builder $c): Builder
  {
    // Пока условия одинаковые - можно не дублировать код
    return $this->beforeGet($c);
  }
}
