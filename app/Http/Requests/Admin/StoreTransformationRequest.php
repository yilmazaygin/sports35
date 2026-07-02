<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransformationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'before_image' => ['required', 'image', 'max:10240'],
            'after_image' => ['required', 'image', 'max:10240'],
            'description_tr' => ['nullable', 'string', 'max:500'],
            'description_en' => ['nullable', 'string', 'max:500'],
            'duration_label_tr' => ['nullable', 'string', 'max:100'],
            'duration_label_en' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
