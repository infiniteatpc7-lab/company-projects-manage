<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amc extends Model
{
    protected $fillable = [
        'client_id',
        'project_id',
        'title',
        'amount',
        'billing_cycle',
        'start_date',
        'next_due_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date:Y-m-d',
        'next_due_date' => 'date:Y-m-d',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function payments()
    {
        return $this->hasMany(AmcPayment::class);
    }
}
