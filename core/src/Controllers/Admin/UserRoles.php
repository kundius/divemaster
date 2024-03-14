<?php

namespace App\Controllers\Admin;

use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;
use Vesp\Controllers\ModelController;

class UserRoles extends ModelController
{
    protected string|array $scope = 'roles';
    protected string $model = UserRole::class;

    protected function beforeCount(Builder $c): Builder
    {
        if ($query = $this->getProperty('query')) {
            $c->where('title', 'LIKE', "%$query%");
        }

        if ($scopes = $this->getProperty('scope')) {
            foreach (explode(',', $scopes) as $scope) {
                $c->where('scope', 'LIKE', '%"' . $scope . '"%');
            }
        }

        return $c;
    }

    protected function afterCount(Builder $c): Builder
    {
        $c->withCount('users');

        return $c;
    }
}
