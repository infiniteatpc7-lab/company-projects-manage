<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAmcRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => ['required', 'exists:clients,id'],
            'project_id' => [
                'nullable',
                'exists:projects,id',
                Rule::exists('projects', 'id')->where(function ($query) {
                    $query->where('client_id', $this->client_id);
                }),
            ],
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'billing_cycle' => ['required', 'in:Yearly'],
            'start_date' => ['required', 'date'],
            'next_due_date' => ['required', 'date'],
            'status' => ['required', 'in:Active,Expired,Cancelled'],
            'notes' => ['nullable', 'string'],
        ];
    }
    
    public function messages(): array
    {
        return [
            'project_id.exists' => 'The selected project does not belong to the selected client.',
        ];
    }
}
