<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Client;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('projects.view'), 403);

        $query = Project::with('client');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', '%' . $search . '%')
                  ->orWhereHas('client', function ($q2) use ($search) {
                      $q2->where('company_name', 'ilike', '%' . $search . '%');
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $projects = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        abort_unless(auth()->user()->can('projects.create'), 403);
        return Inertia::render('Projects/Create', [
            'clients' => Client::orderBy('company_name')->get(['id', 'company_name']),
        ]);
    }

    public function store(StoreProjectRequest $request)
    {
        abort_unless(auth()->user()->can('projects.create'), 403);

        $project = Project::create($request->validated());

        ActivityLog::create([
            'user_id'      => auth()->id(),
            'action'       => 'created',
            'subject_type' => Project::class,
            'subject_id'   => $project->id,
            'new_values'   => $project->toArray(),
            'ip_address'   => $request->ip(),
        ]);

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    public function show(Project $project)
    {
        abort_unless(auth()->user()->can('projects.view'), 403);
        $project->load('client');
        return Inertia::render('Projects/Show', ['project' => $project]);
    }

    public function edit(Project $project)
    {
        abort_unless(auth()->user()->can('projects.edit'), 403);
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'clients' => Client::orderBy('company_name')->get(['id', 'company_name']),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        abort_unless(auth()->user()->can('projects.edit'), 403);

        $oldValues = $project->toArray();
        $project->update($request->validated());

        ActivityLog::create([
            'user_id'      => auth()->id(),
            'action'       => 'updated',
            'subject_type' => Project::class,
            'subject_id'   => $project->id,
            'old_values'   => $oldValues,
            'new_values'   => $project->fresh()->toArray(),
            'ip_address'   => $request->ip(),
        ]);

        return redirect()->route('projects.index')->with('success', 'Project updated successfully.');
    }

    public function destroy(Request $request, Project $project)
    {
        abort_unless(auth()->user()->can('projects.delete'), 403);

        $oldValues = $project->toArray();
        $project->delete();

        ActivityLog::create([
            'user_id'      => auth()->id(),
            'action'       => 'deleted',
            'subject_type' => Project::class,
            'subject_id'   => $project->id,
            'old_values'   => $oldValues,
            'ip_address'   => $request->ip(),
        ]);

        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }
}
