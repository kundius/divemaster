<?php

namespace App\Controllers\User;

use Psr\Http\Message\ResponseInterface;

class Profile extends \Vesp\Controllers\User\Profile
{
    protected string|array $scope = 'profile';

    public function patch(): ResponseInterface
    {
        if ($password = trim($this->getProperty('password', ''))) {
            $this->user->password = $password;
        }

        foreach (['username', 'fullname', 'email'] as $key) {
            if ($value = trim($this->getProperty($key, ''))) {
                $this->user->setAttribute($key, $value);
            }
        }
        $this->user->save();

        return $this->get();
    }
}
