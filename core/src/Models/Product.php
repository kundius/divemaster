<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $category_id
 * @property string $title
 * @property ?string $description
 * @property string $sku
 * @property float $price
 * @property bool $active
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @property-read Category $category
 */
class Product extends Model
{
  protected $guarded = ['id', 'created_at', 'updated_at'];
  protected $casts = [
    'active' => 'boolean',
    'price' => 'float',
  ];

  //  Каждый товар принадлежит одной категории
  public function category(): BelongsTo
  {
    return $this->belongsTo(Category::class);
  }
}