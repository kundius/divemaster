<?php

namespace App\Controllers\Admin\Product;

use App\Models\Product;
use App\Models\ProductFile;
use Illuminate\Database\Eloquent\Builder;
use Vesp\Controllers\ModelController;

class Files extends ModelController
{
  protected $scope = 'products';
  protected $model = ProductFile::class;
  protected $primaryKey = ['product_id', 'file_id'];
  /** @var Product product */
  protected $product;

  public function checkScope(string $method): ?ResponseInterface
  {
    if ($check = parent::checkScope($method)) {
      return $check;
    }

    if (!$this->product = Product::query()->find($this->getProperty('product_id'))) {
      return $this->failure('Not Found', 404);
    }

    return null;
  }

  protected function beforeGet(Builder $c): Builder
  {
    $c->where('product_id', $this->product->id);
    $c->with('file:id,updated_at');

    return $c;
  }

  protected function beforeCount(Builder $c): Builder
  {
    return $this->beforeGet($c);
  }

  protected function afterCount(Builder $c): Builder
  {
    $c->with('file:id,updated_at');
    $c->orderBy('rank');

    return $c;
  }
}
