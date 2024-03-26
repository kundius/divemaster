<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class File extends \Vesp\Models\File
{

  public function productFiles(): HasMany
  {
    return $this->hasMany(ProductFile::class);
  }
}
