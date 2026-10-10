<?php

namespace App\Observers;

use App\Services\AuditService;
use Illuminate\Database\Eloquent\Model;

class AuditObserver
{
    public function created(Model $model): void { app(AuditService::class)->modelChanged($model, 'created'); }
    public function updated(Model $model): void { app(AuditService::class)->modelChanged($model, 'updated'); }
    public function deleted(Model $model): void { app(AuditService::class)->modelChanged($model, 'deleted'); }
}
