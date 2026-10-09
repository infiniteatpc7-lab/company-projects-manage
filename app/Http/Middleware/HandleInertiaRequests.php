<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $permissions = [];
        $roles = [];

        if ($user) {
            $permissions = Cache::remember("user_{$user->id}_perms", 300, function () use ($user) {
                return $user->getAllPermissions()->pluck('name')->values()->all();
            });

            $roles = Cache::remember("user_{$user->id}_roles", 300, function () use ($user) {
                return $user->getRoleNames()->values()->all();
            });
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user'        => $user ? [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                ] : null,
                'permissions' => $permissions,
                'roles'       => $roles,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ];
    }
}
