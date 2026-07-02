<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMediaRequest;
use App\Models\MediaFile;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function __construct(private ImageOptimizer $imageOptimizer) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Media/Index', [
            'files' => MediaFile::query()
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (MediaFile $file) => [
                    'id' => $file->id,
                    'url' => $file->url(),
                    'original_name' => $file->original_name,
                    'mime_type' => $file->mime_type,
                    'size' => $file->size,
                    'collection' => $file->collection,
                    'alt_tr' => $file->alt_tr,
                    'alt_en' => $file->alt_en,
                    'created_at' => $file->created_at?->toDateTimeString(),
                ]),
            'collections' => ['general', 'gallery', 'blog', 'hero'],
        ]);
    }

    public function store(StoreMediaRequest $request): RedirectResponse
    {
        $uploadedFile = $request->file('file');
        $path = str_starts_with($uploadedFile->getMimeType(), 'image/')
            ? $this->imageOptimizer->optimizeAndStore($uploadedFile, 'media/'.date('Y/m'))
            : $uploadedFile->store('media/'.date('Y/m'), 'public');

        MediaFile::create([
            'disk' => 'public',
            'path' => $path,
            'filename' => basename($path),
            'original_name' => $uploadedFile->getClientOriginalName(),
            'mime_type' => mime_content_type(Storage::disk('public')->path($path)) ?: $uploadedFile->getMimeType(),
            'size' => Storage::disk('public')->size($path),
            'collection' => $request->validated('collection', 'general'),
            'alt_tr' => $request->validated('alt_tr'),
            'alt_en' => $request->validated('alt_en'),
        ]);

        return back()->with('success', __('admin.messages.uploaded'));
    }

    public function destroy(MediaFile $mediaFile): RedirectResponse
    {
        Storage::disk($mediaFile->disk)->delete($mediaFile->path);
        $mediaFile->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }
}
