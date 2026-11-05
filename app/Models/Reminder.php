<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    protected $fillable = [
        'client_id',
        'type',
        'title',
        'description',
        'due_date',
        'reminder_date',
        'status',
        'priority',
        'assigned_to',
    ];

    protected $casts = [
        'due_date' => 'date:Y-m-d',
        'reminder_date' => 'date:Y-m-d',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
