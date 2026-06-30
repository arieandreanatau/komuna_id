<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_roles_can_be_listed(): void
    {
        Role::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/roles');

        $response->assertOk();
    }

    public function test_permissions_can_be_listed(): void
    {
        $response = $this->getJson('/api/v1/permissions');

        $response->assertOk();
    }
}
