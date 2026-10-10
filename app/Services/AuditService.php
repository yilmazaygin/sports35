<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Lead;
use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditService
{
    public function record(string $action, Model|string $model, mixed $id = null, array $changes = []): void
    {
        if (! Auth::check()) {
            return;
        }

        $type = is_string($model) ? $model : $model::class;
        $auditableId = is_string($model) ? $id : $model->getKey();

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'auditable_type' => $type,
            'auditable_id' => $auditableId === null ? null : (string) $auditableId,
            'changes' => $this->safeChanges($changes),
        ]);
    }

    public function modelChanged(Model $model, string $action): void
    {
        $changes = $action === 'updated' ? $model->getChanges() : $model->getAttributes();
        $allowed = ['status', 'note', 'is_published', 'is_active', 'sort_order', 'cash_price', 'card_price', 'duration_months', 'starts_at', 'ends_at', 'opens_at', 'closes_at', 'is_closed', 'show_banner', 'show_on_contact', 'discount', 'label', 'platform', 'post_url', 'role', 'name', 'title_tr', 'title_en', 'caption_tr', 'caption_en', 'alt_tr', 'alt_en'];
        $changes = array_intersect_key($changes, array_flip($allowed));

        if ($model instanceof Lead && array_key_exists('note', $changes)) {
            $changes['note_changed'] = true;
            unset($changes['note']);
        }

        if ($model instanceof SiteSetting && array_key_exists('value', $changes)) {
            $changes['value_changed'] = true;
            unset($changes['value']);
        }

        $this->record($action, $model, null, $changes);
    }

    private function safeChanges(array $changes): array
    {
        unset($changes['password'], $changes['remember_token'], $changes['email'], $changes['phone']);
        return collect($changes)->map(fn ($value) => is_scalar($value) || $value === null ? $value : (is_array($value) ? '[structured]' : '[value]'))->take(30)->all();
    }
}
