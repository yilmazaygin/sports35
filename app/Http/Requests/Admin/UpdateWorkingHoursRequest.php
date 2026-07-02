<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkingHoursRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hours' => ['required', 'array', 'size:7'],
            'hours.*.id' => ['required', 'exists:working_hours,id'],
            'hours.*.opens_at' => ['nullable', 'date_format:H:i', 'required_unless:hours.*.is_closed,true'],
            'hours.*.closes_at' => ['nullable', 'date_format:H:i', 'required_unless:hours.*.is_closed,true', 'after:hours.*.opens_at'],
            'hours.*.is_closed' => ['required', 'boolean'],
        ];
    }
}
