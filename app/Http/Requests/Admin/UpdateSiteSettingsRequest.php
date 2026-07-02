<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contact.phone' => ['nullable', 'string', 'max:50'],
            'contact.whatsapp' => ['nullable', 'string', 'max:20'],
            'contact.email' => ['nullable', 'email', 'max:255'],
            'contact.address_tr' => ['nullable', 'string', 'max:500'],
            'contact.address_en' => ['nullable', 'string', 'max:500'],
            'social.facebook' => ['nullable', 'url', 'max:500'],
            'social.instagram' => ['nullable', 'url', 'max:500'],
            'contact.maps_embed' => ['nullable', 'url', 'max:2000'],
        ];
    }
}
