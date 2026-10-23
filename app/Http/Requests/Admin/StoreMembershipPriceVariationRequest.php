<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMembershipPriceVariationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('package_prices')) {
            $this->merge([
                'package_prices' => collect($this->input('package_prices', []))
                    ->map(fn ($price) => $price === '' || $price === null ? null : $price)
                    ->all(),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'name_tr' => ['required', 'string', 'max:80'],
            'name_en' => ['required', 'string', 'max:80'],
            'package_prices' => ['nullable', 'array'],
            'package_prices.*' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
