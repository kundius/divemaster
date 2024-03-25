<?php

namespace App\Controllers\Admin;

use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Vesp\Controllers\ModelController;

class Categories extends ModelController
{
  protected string|array $scope = 'products';
  protected string $model = Category::class;

  protected function beforeCount(Builder $c): Builder
  {
    if ($query = $this->getProperty('query')) {
      $c->where(
        static function (Builder $c) use ($query) {
          $c->where('title', 'LIKE', "%$query%");
        }
      );
    }

    return $c;
  }
}
