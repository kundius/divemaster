<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductFile extends Model
{
  public bool $timestamps = false;
  public bool $incrementing = false;
  protected iterable|object $primaryKey = ['product_id', 'file_id'];

  public function getKey(): array
  {
    $key = [];
    foreach ($this->primaryKey as $item) {
      $key[$item] = $this->getAttribute($item);
    }

    return $key;
  }

  protected function setKeysForSaveQuery($query): Builder
  {
    foreach ($this->getKey() as $key => $value) {
      $query->where($key, $this->original[$key] ?? $value);
    }

    return $query;
  }
}
