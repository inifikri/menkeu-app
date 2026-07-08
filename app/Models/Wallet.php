<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'balance', 'type', 'color', 'icon'];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
