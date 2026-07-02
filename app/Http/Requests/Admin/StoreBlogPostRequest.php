<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->blog_category_id === '') {
            $this->merge(['blog_category_id' => null]);
        }
    }

    public function rules(): array
    {
        return [
            'blog_category_id' => ['nullable', 'exists:blog_categories,id'],
            'title_tr' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'excerpt_tr' => ['nullable', 'string', 'max:1000'],
            'excerpt_en' => ['nullable', 'string', 'max:1000'],
            'content_tr' => ['required', 'string'],
            'content_en' => ['required', 'string'],
            'meta_title_tr' => ['nullable', 'string', 'max:255'],
            'meta_title_en' => ['nullable', 'string', 'max:255'],
            'meta_description_tr' => ['nullable', 'string', 'max:500'],
            'meta_description_en' => ['nullable', 'string', 'max:500'],
            'featured_image' => ['nullable', 'string', 'max:500'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['boolean'],
        ];
    }
}
