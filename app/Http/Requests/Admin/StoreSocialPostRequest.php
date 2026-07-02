<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSocialPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'platform' => ['required', 'string', 'in:instagram,facebook'],
            'image' => ['required', 'image', 'max:10240'],
            'post_url' => ['required', 'url', 'max:500'],
            'caption_tr' => ['nullable', 'string', 'max:500'],
            'caption_en' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
