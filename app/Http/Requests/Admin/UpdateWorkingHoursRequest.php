<?php

namespace App\Http\Requests\Admin;

use App\Models\WorkingHour;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateWorkingHoursRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'layout' => ['required', Rule::in(array_keys(WorkingHour::LAYOUTS))],
            'groups' => ['required', 'array'],
            'groups.*.key' => ['required', 'string'],
            'groups.*.opens_at' => ['nullable', 'date_format:H:i', 'required_unless:groups.*.is_closed,true'],
            'groups.*.closes_at' => ['nullable', 'date_format:H:i', 'required_unless:groups.*.is_closed,true', 'after:groups.*.opens_at'],
            'groups.*.is_closed' => ['required', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $layout = $this->input('layout');
            $expected = array_keys(WorkingHour::LAYOUTS[$layout] ?? []);
            $given = collect($this->input('groups', []))->pluck('key')->sort()->values()->all();
            $expected = collect($expected)->sort()->values()->all();

            if ($given !== $expected) {
                $validator->errors()->add('groups', __('validation.required'));
            }
        });
    }
}
