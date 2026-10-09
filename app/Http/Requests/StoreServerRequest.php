<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServerRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', 'unique:servers,name'],
            'provider' => ['nullable', 'string', 'max:255'],
            'managed_by' => ['required', 'in:Company,Client'],
            'ip_address' => ['nullable', 'string', 'max:255'],
            'plan' => ['nullable', 'string', 'max:255'],
            'purchase_date' => ['nullable', 'date'],
            'renewal_date' => ['nullable', 'date', 'after_or_equal:purchase_date'],
            'renewal_cost' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:Active,Expired,Suspended'],
            'notes' => ['nullable', 'string'],

            'username' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'password' => ['nullable', 'string', 'max:255'],
            'credential_notes' => ['nullable', 'string'],
        ];
    }
    
    public function messages(): array
    {
        return [
            'project_id.exists' => 'The selected project does not belong to the selected client.',
        ];
    }
}
