<?php

namespace App\Controllers\Web;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Vesp\Controllers\ModelController;

class Products extends ModelController
{
  protected $model = Product::class;

  protected function beforeGet(Builder $c): Builder
  {
    // Не только товар должен быть включен
    $c->where('active', true);
    // Но и его категория!
    $c->whereHas('category', static function (Builder $c) {
      $c->where('active', true);
    });

    return $c;
  }

  protected function beforeCount(Builder $c): Builder
  {
    return $this->beforeGet($c);
  }

  protected function afterCount(Builder $c): Builder
  {
    // Не забываем выбрать категорию товара, пригодится
    $c->with('category:id,title');

    return $c;
  }
}
