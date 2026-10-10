<?php

namespace Tests\Unit;

use App\Support\SafeHtml;
use PHPUnit\Framework\TestCase;

class SafeHtmlTest extends TestCase
{
    public function test_it_preserves_basic_rich_text_and_removes_unsafe_markup(): void
    {
        $html = '<h2>Plan</h2><p><strong>Strong</strong> <a href="https://example.com" target="_blank">link</a></p>'
            . '<script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(2)">';

        $safe = SafeHtml::sanitize($html);

        $this->assertStringContainsString('<h2>Plan</h2>', $safe);
        $this->assertStringContainsString('<strong>Strong</strong>', $safe);
        $this->assertStringContainsString('href="https://example.com"', $safe);
        $this->assertStringContainsString('rel="noopener noreferrer"', $safe);
        $this->assertStringNotContainsString('<script', $safe);
        $this->assertStringNotContainsString('javascript:', $safe);
        $this->assertStringNotContainsString('onerror', $safe);
    }
}
