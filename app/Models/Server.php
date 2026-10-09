<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Server extends Model
{
    protected $fillable = [
        'client_id',
        'project_id',
        'name',
        'provider',
        'managed_by',
        'ip_address',
        'plan',
        'purchase_date',
        'renewal_date',
        'renewal_cost',
        'status',
        'notes',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'renewal_date' => 'date',
        'renewal_cost' => 'decimal:2',
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
        return $this->hasOne(ServerCredential::class);
    }
}
