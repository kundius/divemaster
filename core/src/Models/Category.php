<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $title
 * @property ?string $description
 * @property bool $active
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @property-read Product[] $products
 */
class Category extends Model
{
  protected $guarded = ['id', 'created_at', 'updated_at'];
  protected $casts = ['active' => 'boolean'];

  // Каждая категория может иметь много товаров
  public function products(): HasMany
  {
    return $this->hasMany(Product::class);
  }
}
