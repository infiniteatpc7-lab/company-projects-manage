<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServerCredential extends Model
{
    protected $fillable = [
        'server_id',
        'username',
        'email',
        'encrypted_password',
        'notes',
    ];

    public function server()
    {
        return $this->belongsTo(Server::class);
    }
}
