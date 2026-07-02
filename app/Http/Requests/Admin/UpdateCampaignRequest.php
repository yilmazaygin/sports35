<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:100', Rule::unique('campaigns', 'label')->ignore($this->campaign)],
            'title_tr' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'discount_percent' => ['required', 'integer', 'min:1', 'max:90'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['boolean'],
        ];
    }
}
