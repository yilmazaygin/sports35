<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMembershipPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'duration_months' => [
                'required', 'integer', 'min:1', 'max:24',
                Rule::unique('membership_packages', 'duration_months')->ignore($this->membershipPackage),
            ],
            'cash_price' => ['required', 'numeric', 'min:0'],
            'card_price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
