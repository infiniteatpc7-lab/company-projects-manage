<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'company_name',
        'contact_person',
        'email',
        'phone',
        'whatsapp',
        'address',
        'city',
        'state',
        'country',
        'status',
        'notes',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class);
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

    public function reminders()
    {
        return $this->hasMany(Reminder::class);
    }
}
