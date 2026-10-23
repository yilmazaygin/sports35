<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMembershipPriceVariationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name_tr' => ['required', 'string', 'max:80'],
            'name_en' => ['required', 'string', 'max:80'],
        ];
    }
}
