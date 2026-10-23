<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMembershipPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('variation_prices')) {
            $this->merge([
                'variation_prices' => collect($this->input('variation_prices', []))
                    ->map(fn ($price) => $price === '' || $price === null ? null : $price)
                    ->all(),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'duration_months' => ['required', 'integer', 'min:1', 'max:24', 'unique:membership_packages,duration_months'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'variation_prices' => ['nullable', 'array'],
            'variation_prices.*' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
