<?php

namespace Modules\Product\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Product\Database\Factories\ProductCommentFactory;

class ProductComment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'product_id',
        'user_id',
        'parent_id',
        'content',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(ProductComment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(ProductComment::class, 'parent_id')->with('replies');
    }

    public function likes()
    {
        return $this->hasMany(CommentLike::class, 'comment_id');
    }
}
