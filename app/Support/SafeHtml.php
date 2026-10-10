<?php

namespace App\Support;

final class SafeHtml
{
    private const ALLOWED_TAGS = [
        'a', 'b', 'blockquote', 'br', 'code', 'div', 'em', 'h2', 'h3', 'h4',
        'i', 'img', 'li', 'ol', 'p', 'pre', 's', 'span', 'strong', 'u', 'ul',
    ];

    private const ALLOWED_ATTRIBUTES = [
        'a' => ['href', 'target', 'rel', 'title'],
        'img' => ['src', 'alt', 'title', 'width', 'height'],
        '*' => ['class'],
    ];

    public static function sanitize(?string $html): string
    {
        if ($html === null || trim($html) === '') {
            return '';
        }

        $html = preg_replace('/<!--[\s\S]*?-->/', '', $html) ?? '';
        $html = preg_replace(
            '/<\s*(script|style|iframe|object|embed|form|input|button|textarea|select|svg|math|link|meta|base)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/i',
            '',
            $html,
        ) ?? $html;
        $html = preg_replace(
            '/<\s*(script|style|iframe|object|embed|form|input|button|textarea|select|svg|math|link|meta|base)\b[^>]*\/?>/i',
            '',
            $html,
        ) ?? $html;

        $allowedTags = '<' . implode('><', self::ALLOWED_TAGS) . '>';
        $html = strip_tags($html, $allowedTags);

        return preg_replace_callback('/<\/?([a-z0-9]+)([^>]*)>/i', function (array $match): string {
            $tag = strtolower($match[1]);

            if (!in_array($tag, self::ALLOWED_TAGS, true) || str_starts_with($match[0], '</')) {
                return "</{$tag}>";
            }

            $attributes = [];
            preg_match_all(
                '/([a-zA-Z_:][a-zA-Z0-9:_.-]*)\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s"\'=<>`]+))/i',
                $match[2],
                $matches,
                PREG_SET_ORDER,
            );

            foreach ($matches as $attribute) {
                $name = strtolower($attribute[1]);
                $value = $attribute[2] ?? $attribute[3] ?? $attribute[4] ?? '';
                $allowed = in_array($name, self::ALLOWED_ATTRIBUTES[$tag] ?? [], true)
                    || in_array($name, self::ALLOWED_ATTRIBUTES['*'], true);

                if (!$allowed || str_starts_with($name, 'on') || $name === 'style') {
                    continue;
                }

                if (($tag === 'a' && $name === 'href') || ($tag === 'img' && $name === 'src')) {
                    if (!self::isSafeUrl($value)) {
                        continue;
                    }
                }

                $attributes[$name] = htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
            }

            if ($tag === 'a' && ($attributes['target'] ?? null) === '_blank') {
                $attributes['rel'] = 'noopener noreferrer';
            }

            $output = '<' . $tag;
            foreach ($attributes as $name => $value) {
                $output .= " {$name}=\"{$value}\"";
            }

            return $output . '>';
        }, $html) ?? '';
    }

    private static function isSafeUrl(string $url): bool
    {
        return preg_match('/^(https?:|mailto:|tel:|\/|#)/i', trim($url)) === 1;
    }
}
