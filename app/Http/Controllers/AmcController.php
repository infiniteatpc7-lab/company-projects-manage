<?php

namespace App\Http\Controllers;

use App\Models\Amc;
use App\Models\AmcPayment;
use App\Models\Client;
use App\Models\Project;
use App\Models\ActivityLog;
use App\Http\Requests\StoreAmcRequest;
use App\Http\Requests\UpdateAmcRequest;
use App\Http\Requests\StoreAmcPaymentRequest;
use App\Http\Requests\UpdateAmcPaymentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AmcController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('amc.view'), 403);

        $query = Amc::with(['client', 'project']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'ilike', "%{$search}%")
                  ->orWhereHas('client', function ($q) use ($search) {
                      $q->where('company_name', 'ilike', "%{$search}%");
                  });
        }

        if ($request->has('status') && $request->input('status') !== 'All') {
            $query->where('status', $request->input('status'));
        }

        $amcs = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Amc/Index', [
            'amcs'    => $amcs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        abort_unless(auth()->user()->can('amc.create'), 403);

        $clients  = Client::select('id', 'company_name')->orderBy('company_name')->get();
        $projects = Project::select('id', 'name', 'client_id')->orderBy('name')->get();

        return Inertia::render('Amc/Create', [
            'clients'  => $clients,
            'projects' => $projects,
        ]);
    }

    public function store(StoreAmcRequest $request)
    {
        abort_unless(auth()->user()->can('amc.create'), 403);

        DB::beginTransaction();

        try {
            $amc = Amc::create($request->validated());

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'created',
                'subject_type' => Amc::class,
                'subject_id'   => $amc->id,
                'new_values'   => $amc->toArray(),
            ]);

            DB::commit();

            return redirect()->route('amc.index')->with('success', 'AMC created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error creating AMC: ' . $e->getMessage());
        }
    }

    public function show(Amc $amc)
    {
        abort_unless(auth()->user()->can('amc.view'), 403);

        $amc->load(['client', 'project', 'payments' => function ($query) {
            $query->orderBy('due_date', 'desc');
        }]);

        return Inertia::render('Amc/Show', [
            'amc'            => $amc,
            'canManagePayments' => auth()->user()->can('amc.payments'),
        ]);
    }

    public function edit(Amc $amc)
    {
        abort_unless(auth()->user()->can('amc.edit'), 403);

        $clients  = Client::select('id', 'company_name')->orderBy('company_name')->get();
        $projects = Project::select('id', 'name', 'client_id')->orderBy('name')->get();

        return Inertia::render('Amc/Edit', [
            'amc'      => $amc,
            'clients'  => $clients,
            'projects' => $projects,
        ]);
    }

    public function update(UpdateAmcRequest $request, Amc $amc)
    {
        abort_unless(auth()->user()->can('amc.edit'), 403);

        DB::beginTransaction();

        try {
            $amc->update($request->validated());

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'updated',
                'subject_type' => Amc::class,
                'subject_id'   => $amc->id,
                'new_values'   => $amc->toArray(),
            ]);

            DB::commit();

            return redirect()->route('amc.index')->with('success', 'AMC updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error updating AMC: ' . $e->getMessage());
        }
    }

    public function destroy(Amc $amc)
    {
        abort_unless(auth()->user()->can('amc.delete'), 403);

        DB::beginTransaction();

        try {
            $amc->payments()->delete();
            $amc->delete();

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'deleted',
                'subject_type' => Amc::class,
                'subject_id'   => $amc->id,
                'old_values'   => $amc->toArray(),
            ]);

            DB::commit();

            return redirect()->route('amc.index')->with('success', 'AMC deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error deleting AMC: ' . $e->getMessage());
        }
    }

    // Payment Methods

    public function storePayment(StoreAmcPaymentRequest $request, Amc $amc)
    {
        abort_unless(auth()->user()->can('amc.payments'), 403);

        DB::beginTransaction();

        try {
            $paymentData          = $request->validated();
            $paymentData['amc_id'] = $amc->id;

            $payment = AmcPayment::create($paymentData);

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'created',
                'subject_type' => AmcPayment::class,
                'subject_id'   => $payment->id,
                'new_values'   => $payment->toArray(),
            ]);

            DB::commit();

            return back()->with('success', 'Payment added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error adding payment: ' . $e->getMessage());
        }
    }

    public function updatePayment(UpdateAmcPaymentRequest $request, Amc $amc, AmcPayment $payment)
    {
        abort_unless(auth()->user()->can('amc.payments'), 403);

        DB::beginTransaction();

        try {
            if ($payment->amc_id !== $amc->id) {
                throw new \Exception('Payment does not belong to this AMC.');
            }

            $payment->update($request->validated());

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'updated',
                'subject_type' => AmcPayment::class,
                'subject_id'   => $payment->id,
                'new_values'   => $payment->toArray(),
            ]);

            DB::commit();

            return back()->with('success', 'Payment updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error updating payment: ' . $e->getMessage());
        }
    }

    public function destroyPayment(Amc $amc, AmcPayment $payment)
    {
        abort_unless(auth()->user()->can('amc.payments'), 403);

        DB::beginTransaction();

        try {
            if ($payment->amc_id !== $amc->id) {
                throw new \Exception('Payment does not belong to this AMC.');
            }

            $payment->delete();

            ActivityLog::create([
                'user_id'      => auth()->id(),
                'action'       => 'deleted',
                'subject_type' => AmcPayment::class,
                'subject_id'   => $payment->id,
                'old_values'   => $payment->toArray(),
            ]);

            DB::commit();

            return back()->with('success', 'Payment deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error deleting payment: ' . $e->getMessage());
        }
    }
}
