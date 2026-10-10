<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMediaRequest;
use App\Http\Requests\Admin\UpdateMediaRequest;
use App\Models\MediaFile;
use App\Models\BlogPost;
use App\Models\GalleryItem;
use App\Models\Facility;
use App\Models\Trainer;
use App\Models\Transformation;
use App\Models\SocialPost;
use App\Models\Testimonial;
use App\Services\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function __construct(private ImageOptimizer $imageOptimizer) {}

    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $mime = $request->string('mime')->trim()->toString();
        $files = MediaFile::query()
                ->when($search !== '', fn ($q) => $q->where('original_name', 'like', "%{$search}%"))
                ->when($mime !== '', fn ($q) => $q->where('mime_type', 'like', "%{$mime}%"))
                ->orderByDesc('created_at')
                ->paginate(24)->withQueryString();
        $paths = $files->getCollection()->pluck('path')->all();
        $referencedPaths = collect([
            BlogPost::whereIn('featured_image', $paths)->pluck('featured_image'),
            GalleryItem::whereIn('image_path', $paths)->pluck('image_path'),
            Facility::whereIn('image_path', $paths)->pluck('image_path'),
            Trainer::whereIn('photo_path', $paths)->pluck('photo_path'),
            Transformation::whereIn('before_image', $paths)->pluck('before_image'),
            Transformation::whereIn('after_image', $paths)->pluck('after_image'),
            SocialPost::whereIn('image_path', $paths)->pluck('image_path'),
            Testimonial::whereIn('photo_path', $paths)->pluck('photo_path'),
        ])->flatten()->filter()->flip();

        return Inertia::render('Admin/Media/Index', [
            'files' => $files->through(fn (MediaFile $file) => [
                    'id' => $file->id,
                    'url' => $file->url(),
                    'original_name' => $file->original_name,
                    'mime_type' => $file->mime_type,
                    'size' => $file->size,
                    'collection' => $file->collection,
                    'alt_tr' => $file->alt_tr,
                    'alt_en' => $file->alt_en,
                    'created_at' => $file->created_at?->toDateTimeString(),
                    'referenced' => $referencedPaths->has($file->path),
                ]),
            'search' => $search, 'mime' => $mime,
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
        if ($this->isReferenced($mediaFile->path)) {
            return back()->with('error', __('admin.media.in_use'));
        }
        Storage::disk($mediaFile->disk)->delete($mediaFile->path);
        $mediaFile->delete();

        return back()->with('success', __('admin.messages.deleted'));
    }

    public function update(UpdateMediaRequest $request, MediaFile $mediaFile): RedirectResponse
    {
        $mediaFile->update($request->validated());

        return back()->with('success', __('admin.messages.saved'));
    }

    private function isReferenced(string $path): bool
    {
        return BlogPost::where('featured_image', $path)->exists()
            || GalleryItem::where('image_path', $path)->exists()
            || Facility::where('image_path', $path)->exists()
            || Trainer::where('photo_path', $path)->exists()
            || Transformation::where('before_image', $path)->orWhere('after_image', $path)->exists()
            || SocialPost::where('image_path', $path)->exists()
            || Testimonial::where('photo_path', $path)->exists();
    }
}
