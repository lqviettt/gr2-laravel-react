<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    protected $fillable = ['name', 'code','category_id', 'quantity', 'image', 'price', 'description' , 'status'];

    public function category(){
        return $this->belongsTo(Category::class);
    }
}
