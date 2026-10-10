<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\GalleryCategory;
use App\Models\GalleryItem;
use App\Models\MediaFile;
use App\Services\ImageOptimizer;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class Sports35PhotoSeeder extends Seeder
{
    public function run(ImageOptimizer $imageOptimizer): void
    {
        $category = GalleryCategory::updateOrCreate(
            ['slug' => 'sports35-salon'],
            [
                'name_tr' => 'Sports35 Salon',
                'name_en' => 'Sports35 Gym',
                'sort_order' => 1,
            ],
        );

        $photos = [
            [
                'file' => 'gym-overview.png',
                'caption_tr' => 'Sports35 antrenman alanı',
                'caption_en' => 'Sports35 training floor',
                'alt_tr' => 'Sports35 salonunun aynalı ve serbest ağırlık ekipmanlı iç alanı',
                'alt_en' => 'Sports35 gym interior with mirrors and free-weight equipment',
                'sort_order' => 1,
            ],
            [
                'file' => 'strength-area.png',
                'caption_tr' => 'Güç antrenmanı alanı',
                'caption_en' => 'Strength training area',
                'alt_tr' => 'Sports35 salonunda ağırlık plakaları bulunan güç antrenmanı alanı',
                'alt_en' => 'Strength training area at Sports35 with plate-loaded equipment',
                'sort_order' => 2,
            ],
            [
                'file' => 'free-weight-area.png',
                'caption_tr' => 'Serbest ağırlık alanı',
                'caption_en' => 'Free-weight area',
                'alt_tr' => 'Sports35 salonunda bench ve dambıl ekipmanlarının bulunduğu alan',
                'alt_en' => 'Sports35 free-weight area with benches and dumbbells',
                'sort_order' => 3,
            ],
            [
                'file' => 'equipment-room.png',
                'caption_tr' => 'Antrenman ekipmanları',
                'caption_en' => 'Training equipment',
                'alt_tr' => 'Sports35 salonunda çeşitli ağırlık makinelerinin bulunduğu iç alan',
                'alt_en' => 'Sports35 interior with a range of weight machines',
                'sort_order' => 4,
            ],
            [
                'file' => 'machine-area.png',
                'caption_tr' => 'Makine alanı',
                'caption_en' => 'Machine area',
                'alt_tr' => 'Sports35 salonunda aynalar ve ağırlık makineleri bulunan alan',
                'alt_en' => 'Sports35 machine area with mirrors and weight equipment',
                'sort_order' => 5,
            ],
            [
                'file' => 'cable-area.png',
                'caption_tr' => 'Kablo ve fonksiyonel çalışma alanı',
                'caption_en' => 'Cable and functional training area',
                'alt_tr' => 'Sports35 salonunda kablo istasyonlarının bulunduğu alan',
                'alt_en' => 'Sports35 area with cable training stations',
                'sort_order' => 6,
            ],
            [
                'file' => 'cable-machine.png',
                'caption_tr' => 'Kablo istasyonu',
                'caption_en' => 'Cable station',
                'alt_tr' => 'Sports35 salonunda aynalı duvar önünde kablo istasyonu',
                'alt_en' => 'Cable station in front of a mirrored wall at Sports35',
                'sort_order' => 7,
            ],
            [
                'file' => 'motivation-wall.png',
                'caption_tr' => 'Sports35 antrenman atmosferi',
                'caption_en' => 'Sports35 training atmosphere',
                'alt_tr' => 'Sports35 salonunda antrenman alanı ve motivasyon yazısı',
                'alt_en' => 'Sports35 training area with a motivational wall message',
                'sort_order' => 8,
            ],
            [
                'file' => 'exterior.png',
                'caption_tr' => 'Sports35 Fitness Center dış görünümü',
                'caption_en' => 'Sports35 Fitness Center exterior',
                'alt_tr' => 'Sports35 Fitness Center girişinin dış görünümü',
                'alt_en' => 'Exterior view of the Sports35 Fitness Center entrance',
                'sort_order' => 9,
            ],
        ];

        foreach ($photos as $photo) {
            $media = $this->mediaFor($photo, $imageOptimizer);

            GalleryItem::updateOrCreate(
                ['gallery_category_id' => $category->id, 'image_path' => $media->path],
                [
                    'caption_tr' => $photo['caption_tr'],
                    'caption_en' => $photo['caption_en'],
                    'sort_order' => $photo['sort_order'],
                    'is_active' => true,
                ],
            );
        }

        $facilities = [
            [
                'file' => 'free-weight-area.png',
                'name_tr' => 'Serbest ağırlık alanı',
                'name_en' => 'Free-weight area',
                'category' => 'strength',
                'description_tr' => 'Bench ve dambıl ekipmanlarının bulunduğu antrenman alanı.',
                'description_en' => 'Training area with benches and dumbbell equipment.',
                'sort_order' => 1,
            ],
            [
                'file' => 'machine-area.png',
                'name_tr' => 'Makine alanı',
                'name_en' => 'Machine area',
                'category' => 'strength',
                'description_tr' => 'Ağırlık makineleri ve aynalı çalışma alanı.',
                'description_en' => 'Weight machines and a mirrored training area.',
                'sort_order' => 2,
            ],
            [
                'file' => 'cable-machine.png',
                'name_tr' => 'Kablo istasyonu',
                'name_en' => 'Cable station',
                'category' => 'functional',
                'description_tr' => 'Kablo istasyonunda fonksiyonel ve kuvvet odaklı çalışmalar.',
                'description_en' => 'Functional and strength-focused training at the cable station.',
                'sort_order' => 3,
            ],
        ];

        foreach ($facilities as $facility) {
            $media = $this->mediaFor($facility, $imageOptimizer);

            Facility::updateOrCreate(
                ['name_tr' => $facility['name_tr']],
                [
                    'name_en' => $facility['name_en'],
                    'category' => $facility['category'],
                    'description_tr' => $facility['description_tr'],
                    'description_en' => $facility['description_en'],
                    'image_path' => $media->path,
                    'sort_order' => $facility['sort_order'],
                    'is_active' => true,
                ],
            );
        }
    }

    private function mediaFor(array $photo, ImageOptimizer $imageOptimizer): MediaFile
    {
        $source = resource_path('images/sports35/'.$photo['file']);
        $existing = MediaFile::query()->where('original_name', $photo['file'])->first();

        if (! $existing || ! Storage::disk('public')->exists($existing->path)) {
            $uploaded = new UploadedFile(
                $source,
                $photo['file'],
                mime_content_type($source) ?: 'image/png',
                null,
                true,
            );
            $path = $imageOptimizer->optimizeAndStore($uploaded, 'sports35/'.date('Y/m'));
        } else {
            $path = $existing->path;
        }

        $fullPath = Storage::disk('public')->path($path);

        return MediaFile::updateOrCreate(
            ['original_name' => $photo['file']],
            [
                'disk' => 'public',
                'path' => $path,
                'filename' => basename($path),
                'mime_type' => mime_content_type($fullPath) ?: 'image/png',
                'size' => Storage::disk('public')->size($path),
                'alt_tr' => $photo['alt_tr'] ?? ($photo['name_tr'] ?? $photo['file']),
                'alt_en' => $photo['alt_en'] ?? ($photo['name_en'] ?? $photo['file']),
                'collection' => 'gallery',
                'sort_order' => $photo['sort_order'],
            ],
        );
    }
}
