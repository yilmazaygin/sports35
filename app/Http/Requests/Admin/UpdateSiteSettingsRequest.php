<?php

namespace App\Http\Requests\Admin;

use App\Models\SiteSetting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSiteSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $accounts = collect($this->input('social_accounts', []))
            ->map(fn ($account) => [
                'platform' => SiteSetting::platformKey((string) ($account['platform'] ?? $account['name'] ?? '')),
                'url' => trim((string) ($account['url'] ?? '')),
            ])
            ->filter(fn (array $account) => $account['platform'] !== null && $account['url'] !== '')
            ->unique('platform')
            ->values()
            ->all();

        $fields = [];

        foreach (['phone', 'whatsapp', 'email', 'address_tr', 'address_en', 'maps_embed', 'maps_url'] as $field) {
            if ($this->input($field) === '') {
                $fields[$field] = null;
            }
        }

        $this->merge([...$fields, 'social_accounts' => $accounts]);
    }

    public function rules(): array
    {
        return [
            'phone' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'address_tr' => ['nullable', 'string', 'max:500'],
            'address_en' => ['nullable', 'string', 'max:500'],
            'maps_embed' => ['nullable', 'url', 'max:2000'],
            'maps_url' => ['nullable', 'url', 'max:2000'],
            'social_accounts' => ['array', 'max:5'],
            'social_accounts.*.platform' => ['required', 'string', Rule::in(array_keys(SiteSetting::SOCIAL_PLATFORMS))],
            'social_accounts.*.url' => ['required', 'url', 'max:500'],
            'video_audio' => ['boolean'],
            'why_us' => ['sometimes', 'array'],
            'why_us.paragraph_tr' => ['required_with:why_us', 'string', 'max:1000'],
            'why_us.paragraph_en' => ['required_with:why_us', 'string', 'max:1000'],
            'why_us.items' => ['required_with:why_us', 'array', 'size:4'],
            'why_us.items.*.icon' => ['required', 'string', Rule::in(SiteSetting::WHY_US_ICONS)],
            'why_us.items.*.title_tr' => ['required', 'string', 'max:80'],
            'why_us.items.*.title_en' => ['required', 'string', 'max:80'],
            'why_us.items.*.body_tr' => ['required', 'string', 'max:240'],
            'why_us.items.*.body_en' => ['required', 'string', 'max:240'],
        ];
    }
}
