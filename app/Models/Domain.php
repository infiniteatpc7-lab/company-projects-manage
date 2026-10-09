<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Domain extends Model
{
    protected $fillable = [
        'client_id',
        'project_id',
        'domain_name',
        'managed_by',
        'registrar',
        'purchase_date',
        'renewal_date',
        'renewal_cost',
        'auto_renew',
        'status',
        'notes',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'renewal_date' => 'date',
        'renewal_cost' => 'decimal:2',
        'auto_renew' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function credential()
    {
        return $this->hasOne(DomainCredential::class);
    }
}
