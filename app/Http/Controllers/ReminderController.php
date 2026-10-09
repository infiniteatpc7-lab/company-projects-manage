<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use App\Models\Client;
use App\Models\User;
use App\Models\ActivityLog;
use App\Http\Requests\StoreReminderRequest;
use App\Http\Requests\UpdateReminderRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReminderController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('reminders.view'), 403);

        $query = Reminder::with(['client', 'assignedUser']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';
            $query->where('title', $like, "%{$search}%")
                  ->orWhereHas('client', function ($q) use ($search, $like) {
                      $q->where('company_name', $like, "%{$search}%");
                  });
        }

        if ($request->has('status') && $request->input('status') !== 'All') {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('priority') && $request->input('priority') !== 'All') {
            $query->where('priority', $request->input('priority'));
        }

        $reminders = $query->orderBy('due_date', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('Reminders/Index', [
            'reminders' => $reminders,
            'filters'   => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function create()
    {
        abort_unless(auth()->user()->can('reminders.create'), 403);

        $clients = Client::select('id', 'company_name')->orderBy('company_name')->get();
        $users   = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Reminders/Create', [
            'clients' => $clients,
            'users'   => $users,
        ]);
    }

    public function store(StoreReminderRequest $request)
    {
        abort_unless(auth()->user()->can('reminders.create'), 403);

        DB::beginTransaction();

        try {
            $reminder = Reminder::create($request->validated());

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'created',
                'subject_type' => Reminder::class,
                'subject_id'   => $reminder->id,
                'new_values'   => $reminder->toArray(),
            ]);

            DB::commit();

            return redirect()->route('reminders.index')->with('success', 'Reminder created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error creating reminder: ' . $e->getMessage());
        }
    }

    public function show(Reminder $reminder)
    {
        abort_unless(auth()->user()->can('reminders.view'), 403);

        $reminder->load(['client', 'assignedUser']);

        return Inertia::render('Reminders/Show', [
            'reminder' => $reminder,
        ]);
    }

    public function edit(Reminder $reminder)
    {
        abort_unless(auth()->user()->can('reminders.edit'), 403);

        $clients = Client::select('id', 'company_name')->orderBy('company_name')->get();
        $users   = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Reminders/Edit', [
            'reminder' => $reminder,
            'clients'  => $clients,
            'users'    => $users,
        ]);
    }

    public function update(UpdateReminderRequest $request, Reminder $reminder)
    {
        abort_unless(auth()->user()->can('reminders.edit'), 403);

        DB::beginTransaction();

        try {
            $reminder->update($request->validated());

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'updated',
                'subject_type' => Reminder::class,
                'subject_id'   => $reminder->id,
                'new_values'   => $reminder->toArray(),
            ]);

            DB::commit();

            return redirect()->route('reminders.index')->with('success', 'Reminder updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error updating reminder: ' . $e->getMessage());
        }
    }

    public function destroy(Reminder $reminder)
    {
        abort_unless(auth()->user()->can('reminders.delete'), 403);

        DB::beginTransaction();

        try {
            $reminder->delete();

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'deleted',
                'subject_type' => Reminder::class,
                'subject_id'   => $reminder->id,
                'old_values'   => $reminder->toArray(),
            ]);

            DB::commit();

            return redirect()->route('reminders.index')->with('success', 'Reminder deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error deleting reminder: ' . $e->getMessage());
        }
    }
}
