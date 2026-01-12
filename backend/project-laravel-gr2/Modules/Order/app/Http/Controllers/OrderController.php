<?php

namespace Modules\Order\Http\Controllers;

use App\Contract\OrderRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Jobs\SendOrderEmailJob;
use App\Services\VNPayService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Order\Helpers\FormatData;
use Modules\Order\Models\Order;

class OrderController extends Controller
{
    /**
     * __construct
     *
     * @param  OrderRepositoryInterface $orderRepository
     * @return void
     */
    public function __construct(
        protected OrderRepositoryInterface $orderRepository,
        protected VNPayService $vnpayService
        ) {}

    /**
     * index
     *
     * @param  Request $request
     * @param  FormatData $formatData
     * @return void
     */
    public function index(Request $request, FormatData $formatData): JsonResponse
    {
        $perPage = $request->input('perPage', 10);
        // $this->authorize('view', Order::class);
        $query = $this->orderRepository
            ->builderQuery()
            ->searchByStatusOrder($request->status)
            ->searchByNameCode($request->search)
            ->searchByPhone($request->phone)
            ->searchByCreated($request->created_by)
            ->searchByDate($request->start_date, $request->end_date)
            ->searchByCode($request->code)
            ->orderBy('created_at', 'desc');

        $paginator = $query->paginate($perPage);
        $formattedData = $formatData->formatData($paginator->getCollection());
        $paginator->setCollection($formattedData);

        return $this->sendSuccess($paginator);
    }

    /**
     * store
     *
     * @param  OrderRequest $request
     * @return JsonResponse
     */
    public function store(OrderRequest $request): JsonResponse
    {
        // $this->authorize('create', Order::class);
        try {
            $result = DB::transaction(function () use ($request) {
                $orderData = $request->storeOrder();

                if (auth()->user()) {
                    $orderData['created_by'] = auth()->user()->user_name ?? auth()->user()->name;
                }

                $order = $this->orderRepository
                    ->createOrder($orderData, $request->order_item);

                if ($order->customer_email) {
                    SendOrderEmailJob::dispatch($order);
                }

                return $order;
            });

            if ($result->payment_method == 'COD' || $result->payment_method == null) {
                return $this->created($result);
            } else {
                $config = $this->vnpayService->fetchVNPay();
                $vnpUrl = $this->vnpayService->generateUrlPayment(
                    $result->payment_method,
                    $result,
                    $config
                );
                $result->payment = $vnpUrl;

                return $this->created($result);
            }
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            Log::error('Error creating order', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Đã xảy ra lỗi khi tạo đơn hàng.',
            ], 500);
        }
    }

    /**
     * show
     *
     * @param  mixed $order
     * @return JsonResponse
     */
    public function show(Order $order): JsonResponse
    {
        // $this->authorize('view', $order);
        $order = $this->orderRepository->find($order);
        $order->load('orderItem.product', 'orderItem.product_variant.product');
        $formattedOrder = (new FormatData())->formatData(collect([$order]))->first();

        return $this->sendSuccess($formattedOrder);
    }

    /**
     * update
     *
     * @param  mixed $request
     * @param  mixed $order
     * @return JsonResponse
     */
    public function update(OrderRequest $request, Order $order, FormatData $formatData): JsonResponse
    {
        // $this->authorize('update', $order);
        if ($order->status === 'canceled') {
            return response()->json([
                'error' => 'Cannot update a canceled order.'
            ], 400);
        }

        try {
            DB::transaction(function () use ($request, $order) {
                $orderData = $request->updateOrder();                
                $this->orderRepository->updateOrder($order, $orderData);
            });

            $order->load('orderItem.product', 'orderItem.product_variant.product');
            $formattedOrder = $formatData->formatData(collect([$order]))->first();

            return $this->updated($formattedOrder);
        } catch (\Exception $e) {

            return $this->sendError($e->getMessage());
        }
    }

    /**
     * destroy
     *
     * @param  mixed $id
     * @return JsonResponse
     */
    public function destroy(Order $order): JsonResponse
    {
        // $this->authorize('delete', $order);
        $order->delete($order);

        return $this->deteled();
    }
}
