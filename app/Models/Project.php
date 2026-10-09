<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'client_id',
        'name',
        'project_type',
        'website_url',
        'status',
        'start_date',
        'deadline',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'deadline' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function domains()
    {
        return $this->hasMany(Domain::class);
    }

    public function servers()
    {
        return $this->hasMany(Server::class);
    }

    public function amcs()
    {
        return $this->hasMany(Amc::class);
    }
}
