<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class MediaFile extends Model
{
    protected $fillable = [
        'disk',
        'path',
        'filename',
        'original_name',
        'mime_type',
        'size',
        'alt_tr',
        'alt_en',
        'collection',
        'sort_order',
    ];

    public function url(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }
}
