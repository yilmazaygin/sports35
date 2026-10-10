<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupClass extends Model
{
    protected $fillable = [
        'name_tr', 'name_en', 'description_tr', 'description_en', 'difficulty_tr', 'difficulty_en',
        'schedule_text_tr', 'schedule_text_en', 'instructor_name_tr', 'instructor_name_en',
        'sort_order', 'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function localizedName(): string
    {
        return app()->getLocale() === 'en' ? ($this->name_en ?: $this->name_tr) : ($this->name_tr ?: $this->name_en);
    }

    public function localized(string $field): ?string
    {
        $localeField = $field.'_'.app()->getLocale();
        $fallbackField = $field.(app()->getLocale() === 'en' ? '_tr' : '_en');

        return $this->{$localeField} ?: $this->{$fallbackField};
    }
}
