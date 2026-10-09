<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDomainRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $domainId = $this->route('domain')->id;

        return [
            'client_id' => ['required', 'exists:clients,id'],
            'project_id' => [
                'nullable',
                'exists:projects,id',
                Rule::exists('projects', 'id')->where(function ($query) {
                    $query->where('client_id', $this->client_id);
                }),
            ],
            'domain_name' => ['required', 'string', 'max:255', 'unique:domains,domain_name,' . $domainId],
            'managed_by' => ['required', 'in:Company,Client'],
            'registrar' => ['nullable', 'string', 'max:255'],
            'purchase_date' => ['nullable', 'date'],
            'renewal_date' => ['nullable', 'date'],
            'renewal_cost' => ['nullable', 'numeric', 'min:0'],
            'auto_renew' => ['required', 'boolean'],
            'status' => ['required', 'in:Active,Expired,Suspended'],
            'notes' => ['nullable', 'string'],

            'username' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'password' => ['nullable', 'string', 'max:255'], // password might be unchanged
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
