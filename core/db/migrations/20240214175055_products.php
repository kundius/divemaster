<?php

declare(strict_types=1);

use Illuminate\Database\Schema\Blueprint;
use Vesp\Services\Migration;

final class Products extends Migration
{
    public function up(): void
    {
        // Таблица категорий товаров
        $this->schema->create(
            'categories',
            function (Blueprint $table) {
                $table->id();
                $table->foreignId('parent_id')->nullable()->index()->constrained('categories')->nullOnDelete();
                $table->string('title');
                $table->string('alias')->after('description')->unique()->index();
                $table->text('description')->nullable();
                $table->boolean('active')->default(true)->index();
                $table->unsignedInteger('rank')->default(0)->index();
                $table->timestamps();
            }
        );

        // Таблица товаров
        $this->schema->create(
            'products',
            function (Blueprint $table) {
                $table->id();
                // Связь товаров с категорией
                // $table->foreignId('category_id')
                //     // Запрет удаления категории, если в ней есть хотя-бы 1 товар
                //     ->constrained('categories')->restrictOnDelete();
                $table->string('title');
                $table->string('alias')->after('description')->unique()->index();
                $table->text('description')->nullable();
                // Артикул товара должен быть уникальным
                $table->string('sku')->unique();
                // Цену храним в колонке с цифрами после запятой
                $table->unsignedDecimal('price')->nullable();
                $table->boolean('active')->default(true)->index();
                $table->timestamps();
            }
        );
    }

    public function down(): void
    {
        $this->schema->drop('products');
        $this->schema->drop('categories');
    }
}
