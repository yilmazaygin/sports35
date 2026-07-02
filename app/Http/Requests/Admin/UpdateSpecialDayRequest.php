<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSpecialDayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'type' => ['required', 'in:holiday,renovation,half_day,closure,other'],
            'message_tr' => ['required', 'string', 'max:500'],
            'message_en' => ['required', 'string', 'max:500'],
            'opens_at' => ['nullable', 'date_format:H:i'],
            'closes_at' => ['nullable', 'date_format:H:i'],
            'is_closed' => ['boolean'],
            'show_banner' => ['boolean'],
            'is_active' => ['boolean'],
        ];
    }
}
