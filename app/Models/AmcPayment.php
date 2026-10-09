<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AmcPayment extends Model
{
    protected $fillable = [
        'amc_id',
        'amount',
        'due_date',
        'collected_date',
        'payment_method',
        'reference',
        'status',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'collected_date' => 'date',
    ];

    public function amc()
    {
        return $this->belongsTo(Amc::class);
    }
}
