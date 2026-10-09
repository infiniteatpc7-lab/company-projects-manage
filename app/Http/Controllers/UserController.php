<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        abort_unless(auth()->user()->hasRole('Admin'), 403);

        $users = User::with('roles')->orderBy('name')->get()->map(fn($u) => [
            'id'    => $u->id,
            'name'  => $u->name,
            'email' => $u->email,
            'roles' => $u->getRoleNames()->values()->all(),
        ]);

        $roles = Role::orderBy('name')->pluck('name')->values()->all();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        abort_unless(auth()->user()->hasRole('Admin'), 403);

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::defaults()],
            'role'     => ['required', 'string', 'exists:roles,name'],
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($data['role']);

        return redirect()->route('users.index')->with('success', "User {$user->name} created successfully.");
    }

    public function update(Request $request, User $user)
    {
        abort_unless(auth()->user()->hasRole('Admin'), 403);

        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'role'     => ['required', 'string', 'exists:roles,name'],
            'password' => ['nullable', Password::defaults()],
        ]);

        $user->update([
            'name'  => $data['name'],
            'email' => $data['email'],
        ]);

        if (!empty($data['password'])) {
            $user->update(['password' => Hash::make($data['password'])]);
        }

        $user->syncRoles([$data['role']]);

        \Illuminate\Support\Facades\Cache::forget("user_{$user->id}_perms");
        \Illuminate\Support\Facades\Cache::forget("user_{$user->id}_roles");

        return redirect()->route('users.index')->with('success', "User {$user->name} updated successfully.");
    }

    public function destroy(User $user)
    {
        abort_unless(auth()->user()->hasRole('Admin'), 403);

        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        \Illuminate\Support\Facades\Cache::forget("user_{$user->id}_perms");
        \Illuminate\Support\Facades\Cache::forget("user_{$user->id}_roles");

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
