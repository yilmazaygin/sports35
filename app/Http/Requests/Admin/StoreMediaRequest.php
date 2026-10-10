<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'max:10240',
                'mimes:jpg,jpeg,png,gif,webp,pdf,mp4,webm',
                'mimetypes:image/jpeg,image/png,image/gif,image/webp,application/pdf,video/mp4,video/webm',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $sample = @file_get_contents($value->getRealPath(), false, null, 0, 4096);

                    if (is_string($sample) && preg_match('/<\s*svg\b/i', $sample) === 1) {
                        $fail('SVG uploads are not supported.');
                    }
                },
            ],
            'collection' => ['nullable', 'string', 'max:50'],
            'alt_tr' => ['nullable', 'string', 'max:255'],
            'alt_en' => ['nullable', 'string', 'max:255'],
        ];
    }
}
