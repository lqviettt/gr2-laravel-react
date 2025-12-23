<?php

namespace Modules\Order\Models;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;
use Modules\Product\Models\Product;
use Modules\Product\Models\ProductVariant;

class Order extends BaseModel
{
    use HasFactory;

    protected $primaryKey = 'id';
    protected $fillable = [
        'code',
        'created_by',
        'firstname',
        'lastname',
        'customer_phone',
        'customer_email',
        'status',
        'shipping_province',
        'shipping_district',
        'shipping_ward',
        'shipping_address_detail',
        'shipping_fee',
        'total_price',
        'payment_method',
    ];

    protected $appends = ['fullname'];

    protected static function booted()
    {
        static::creating(function ($order) {
            $order->created_by = auth()->user() ? auth()->user()->user_name : "admin";
        });

        static::updating(function ($order) {
            // $order->created_by = Auth::user()->user_name;
            $order->created_by = auth()->user() ? auth()->user()->user_name : "admin";
        
            if ($order->status === 'canceled') {
                $order->logs()->create([
                    'status' => 'canceled',
                    'description' => 'Order has been canceled, stock returned.',
                ]);
            }
        });
    }

    public function getFullnameAttribute()
    {
        return $this->lastname . ' ' . $this->firstname;
    }


    public function orderItem()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_items', 'order_id', 'product_id')
            ->withPivot('quantity', 'price');
    }

    public function product_variants()
    {
        return $this->belongsToMany(ProductVariant::class, 'order_items', 'order_id', 'product_variant_id');
    }

    public function logs()
    {
        return $this->hasMany(OrderHistory::class);
    }

    public function scopeSearchByNameCode($query, $search)
    {
        return $query->when(
            !is_null($search),
            fn($query) => $query->where(function ($query) use ($search) {
                $query->where('lastname', 'like', $search . '%')
                    ->orWhere('firstname', 'like', $search . '%')
                    ->orWhere('code', 'like', $search . '%');
            })
        );
    }

    public function scopeSearchByPhone($query, $phone)
    {
        return $query->when(
            !is_null($phone),
            fn($query) => $query->where(function ($query) use ($phone) {
                $query->where('customer_phone', 'like', '%' . $phone . '%');
            })
        );
    }

    public function scopeSearchByDate($query, $startDate, $endDate)
    {
        return $query->when(
            !is_null($startDate) || !is_null($endDate),
            function ($query) use ($startDate, $endDate) {
                if (!is_null($startDate) && !is_null($endDate)) {
                    $query->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
                } elseif (!is_null($startDate)) {
                    $query->where('created_at', '>=', $startDate . ' 00:00:00');
                } elseif (!is_null($endDate)) {
                    $query->where('created_at', '<=', $endDate . ' 23:59:59');
                }
            }
        );
    }

    public function scopeSearchByStatusOrder($query, $status)
    {
        if (!is_null($status) && $status !== '') {
            $query->where('status', $status);
        }
    }

    public function scopeSearchByCode($query, $code)
    {
        if (!is_null($code) && $code !== '') {
            $query->where('code', $code);
        }
    }
}