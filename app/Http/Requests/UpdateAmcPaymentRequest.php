<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAmcPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0'],
            'due_date' => ['required', 'date'],
            'collected_date' => ['nullable', 'date'],
            'payment_method' => ['nullable', 'string', 'max:255'],
            'reference' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:Pending,Collected,Overdue'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
