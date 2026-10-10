<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFreeTrialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:50', 'regex:/^[0-9+()\s.-]{7,50}$/'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'interested_service' => ['nullable', 'string', 'max:150'],
            'note' => ['nullable', 'string', 'max:1000'],
            'privacy_consent' => ['accepted'],
            'marketing_consent' => ['nullable', 'boolean'],
            'website' => ['nullable', 'size:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'first_name' => __('public.free_trial.first_name'),
            'last_name' => __('public.free_trial.last_name'),
            'phone' => __('public.free_trial.phone'),
            'email' => __('public.free_trial.email'),
            'privacy_consent' => __('public.free_trial.privacy_consent'),
            'marketing_consent' => __('public.free_trial.marketing_consent'),
        ];
    }
}
