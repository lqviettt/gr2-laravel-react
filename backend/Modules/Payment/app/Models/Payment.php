<?php

namespace Modules\Payment\Models;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Order\Models\Order;

class Payment extends BaseModel
{
    use HasFactory;

    protected $table = 'payments';

    protected $fillable = [
        'order_id',
        'vnp_TxnRef',
        'vnp_Amount',
        'vnp_BankCode',
        'vnp_IpAddr',
        'vnp_CreateDate',
        'vnp_ExpireDate',
        'vnp_Locale',
        'payment_status', // pending, success, failed, cancelled
        'vnp_TransactionNo',
        'vnp_CardType',
        'vnp_OrderInfo',
        'vnp_ResponseCode',
        'vnp_TransactionStatus',
    ];

    protected $casts = [
        'vnp_Amount' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('payment_status', $status);
    }

    public function scopeByTxnRef($query, $txnRef)
    {
        return $query->where('vnp_TxnRef', $txnRef);
    }

    public function scopeByOrderId($query, $orderId)
    {
        return $query->where('order_id', $orderId);
    }
}
