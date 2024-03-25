<?php

namespace App\Controllers\Admin;

use App\Models\Product;
use Vesp\Controllers\ModelController;

class Products extends ModelController
{
  protected string|array $scope = 'products';
  protected string $model = Product::class;
}
