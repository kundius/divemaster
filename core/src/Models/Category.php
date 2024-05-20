<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $title
 * @property string $alias
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

  public function parent(): BelongsTo
  {
      return $this->belongsTo(__CLASS__);
  }

  protected function getCurrentRank(): int
  {
      $c = $this->newQuery();
      if ($this->parent_id) {
          $c->where('parent_id', $this->parent_id);
      } else {
          $c->whereNull('parent_id');
      }

      return $c->max('rank') + 1;
  }

  public static function getChildIds(int $parentId, bool $onlyActive = false): array
  {
      $ids = [];

      $children = self::query()->where('parent_id', $parentId)->select('id');
      if ($onlyActive) {
          $children->where('active', true);
      }
      foreach ($children->cursor() as $child) {
          $ids = [...$ids, $child->id, ...self::getChildIds($child->id, $onlyActive)];
      }

      return $ids;
  }

  public static function getParentIds(int $childId, bool $onlyActive = false): array
  {
      $ids = [];

      $child = self::query()->where('id', $childId)->select('parent_id');
      if ($onlyActive) {
          $child->where('active', true);
      }
      if ($parentId = $child->value('parent_id')) {
          $ids = [$parentId, ...self::getParentIds($parentId)];
      }

      return $ids;
  }
}
