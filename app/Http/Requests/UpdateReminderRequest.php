<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReminderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => ['nullable', 'exists:clients,id'],
            'type' => ['required', 'in:Domain Renewal,Server Renewal,AMC Due,General'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['required', 'date'],
            'reminder_date' => ['required', 'date'],
            'status' => ['required', 'in:Pending,Completed,Dismissed'],
            'priority' => ['required', 'in:Low,Medium,High'],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ];
    }
}
