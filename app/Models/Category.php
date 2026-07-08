<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'icon', 'color', 'budget'];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
