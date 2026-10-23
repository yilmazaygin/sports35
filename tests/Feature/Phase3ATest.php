<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\MediaFile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase3ATest extends TestCase
{
    use RefreshDatabase;

    public function test_media_deletion_is_blocked_when_known_content_references_the_file(): void
    {
        $user = User::factory()->create();
        $media = MediaFile::create(['disk' => 'public', 'path' => 'media/used.jpg', 'filename' => 'used.jpg', 'original_name' => 'used.jpg', 'mime_type' => 'image/jpeg', 'size' => 10, 'collection' => 'blog']);
        BlogPost::create(['title_tr' => 'Test', 'title_en' => 'Test', 'slug' => 'test-used-media', 'content_tr' => 'Test', 'content_en' => 'Test', 'featured_image' => 'media/used.jpg']);

        $this->actingAs($user)->delete('/admin/media/'.$media->id)->assertRedirect();
        $this->assertDatabaseHas('media_files', ['id' => $media->id]);
    }
}
