<?php

declare(strict_types=1);

use Illuminate\Database\Schema\Blueprint;
use Vesp\Services\Migration;

final class ProductFiles extends Migration
{
  public function up(): void
  {
    $this->schema->create(
      'product_files',
      function (Blueprint $table) {
        // Связи с родительскими моделями
        $table->foreignId('product_id')
          ->constrained('products')->cascadeOnDelete();
        $table->foreignId('file_id')
          ->constrained('files')->cascadeOnDelete();
        // Порядок вывода картинок в галерее
        $table->unsignedInteger('rank')->default(0);
        // Картинки можно будет отключать
        $table->boolean('active')->default(true)->index();

        // Назначаем первичный ключ из 2х колонок
        $table->primary(['product_id', 'file_id']);
      }
    );
  }

  public function down(): void
  {
    $this->schema->drop('product_files');
  }
}
