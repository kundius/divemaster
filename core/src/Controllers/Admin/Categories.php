<?php

namespace App\Controllers\Admin;

use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Psr\Http\Message\ResponseInterface;
use Vesp\Controllers\ModelController;

class Categories extends ModelController
{
  protected string|array $scope = 'products';
  protected string $model = Category::class;

  protected function getPrimaryKey(): ?array
  {
      if ($alias = $this->getProperty('alias')) {
          return ['alias' => $alias];
      }

      return null;
  }

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

  protected function beforeSave(Model $record): ?ResponseInterface
  {
    $c = Category::query()->where('alias', $record->alias);
    if ($record->exists) {
      $c->where('id', '!=', $record->id);
    }
    if ($c->count()) {
      return $this->failure('errors.category.alias_exists');
    }

    return null;
  }
}
