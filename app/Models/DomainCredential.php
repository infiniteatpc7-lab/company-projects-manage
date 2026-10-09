<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DomainCredential extends Model
{
    protected $fillable = [
        'domain_id',
        'username',
        'email',
        'encrypted_password',
        'notes',
    ];

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }
}
