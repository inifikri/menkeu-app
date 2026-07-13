<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetSnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'month',
        'category_id',
        'category_name',
        'budget',
        'spent',
        'accuracy',
        'user_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
