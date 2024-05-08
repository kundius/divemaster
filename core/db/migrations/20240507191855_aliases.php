<?php
declare(strict_types=1);

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Schema\Blueprint;
use Vesp\Services\Eloquent;
use Vesp\Services\Migration;

final class Aliases extends Migration
{
    public function up(): void
    {
        // Отключаем проверку связей с другими таблицами
        (new Eloquent())->getConnection()->getSchemaBuilder()->disableForeignKeyConstraints();
        // И удаляем все товары с категориями
        Category::query()->truncate();
        Product::query()->truncate();

        $this->schema->table(
            'categories',
            function (Blueprint $table) {
                $table->string('alias')->after('description')->unique();
            }
        );

        $this->schema->table(
            'products',
            function (Blueprint $table) {
                $table->string('alias')->after('description')->unique();
            }
        );
    }

    public function down(): void
    {
        $this->schema->table(
            'products',
            function (Blueprint $table) {
                $table->dropColumn('alias');
            }
        );

        $this->schema->table(
            'categories',
            function (Blueprint $table) {
                $table->dropColumn('alias');
            }
        );
    }
}
