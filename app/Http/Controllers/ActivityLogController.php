<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('activity_logs.view'), 403);

        $query = ActivityLog::with('user');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('action', 'ilike', "%{$search}%")
                  ->orWhere('subject_type', 'ilike', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'ilike', "%{$search}%");
                  });
            });
        }

        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        $logs  = $query->latest()->paginate(20)->withQueryString();
        $users = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('ActivityLogs/Index', [
            'logs'    => $logs,
            'users'   => $users,
            'filters' => $request->only(['search', 'action', 'user_id']),
        ]);
    }

    public function show(ActivityLog $activityLog)
    {
        abort_unless(auth()->user()->can('activity_logs.view'), 403);

        $activityLog->load('user');

        return Inertia::render('ActivityLogs/Show', [
            'log' => $activityLog,
        ]);
    }
}
