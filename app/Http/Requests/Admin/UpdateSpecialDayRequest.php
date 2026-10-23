<?php

namespace App\Http\Requests\Admin;

use App\Models\SpecialDay;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSpecialDayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('starts_on') && ! $this->filled('ends_on')) {
            $this->merge(['ends_on' => $this->input('starts_on')]);
        }
    }

    public function rules(): array
    {
        return [
            'starts_on' => ['required', 'date'],
            'ends_on' => ['required', 'date', 'after_or_equal:starts_on', $this->overlapRule()],
            'message_tr' => ['required', 'string', 'max:500'],
            'message_en' => ['required', 'string', 'max:500'],
            'opens_at' => ['nullable', 'date_format:H:i'],
            'closes_at' => ['nullable', 'date_format:H:i'],
            'is_closed' => ['boolean'],
            'show_banner' => ['boolean'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'ends_on.after_or_equal' => __('admin.special_days.ends_before_start'),
        ];
    }

    private function overlapRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail): void {
            $starts = $this->input('starts_on');
            $ends = $this->input('ends_on');

            if (! $starts || ! $ends || $ends < $starts) {
                return;
            }

            $current = $this->route('specialDay');
            $ignoreId = $current instanceof SpecialDay ? $current->getKey() : $current;

            if (SpecialDay::rangeOverlaps($starts, $ends, $ignoreId)) {
                $fail(__('admin.special_days.range_overlap'));
            }
        };
    }
}
