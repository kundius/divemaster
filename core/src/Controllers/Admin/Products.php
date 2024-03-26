<?php

namespace App\Controllers\Admin;
use Illuminate\Database\Eloquent\Builder;

use App\Models\Product;
use Vesp\Controllers\ModelController;

class Products extends ModelController
{
  protected string|array $scope = 'products';
  protected string $model = Product::class;

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

  protected function afterCount(Builder $c): Builder
  {
      $c->with('category:id,title');

      return $c;
  }
}
