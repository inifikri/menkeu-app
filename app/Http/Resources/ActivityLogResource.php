<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'action' => $this->action,
            'description' => $this->description,
            'icon' => $this->icon,
            'color' => $this->color,
            'date' => $this->created_at->toISOString(),
            'user' => $this->relationLoaded('user') && $this->user ? [
                'name' => $this->user->name,
                'avatarColor' => $this->user->avatarColor
            ] : null,
        ];
    }
}
