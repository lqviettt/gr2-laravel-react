<?php

namespace Modules\Product\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Product\Models\CommentLike;
use Modules\Product\Models\Product;
use Modules\Product\Models\ProductComment;
use Modules\Product\Models\ProductReview;

class ReviewCommentController extends Controller
{
    public function indexReviews($productId)
    {
        $reviews = ProductReview::with('user:id,name')
            ->where('product_id', $productId)
            ->latest()
            ->paginate(10);

        $product = Product::find($productId);
        $averageRating = $product ? $product->averageRating() : 0;
        $totalReviews = $product ? $product->reviewsCount() : 0;

        return $this->sendSuccess([
            'reviews' => $reviews,
            'meta' => [
                'average_rating' => round($averageRating, 1),
                'total_reviews' => $totalReviews,
            ],
        ]);
    }

    public function storeOrUpdateReview(Request $request, $productId)
    {
        $user = auth()->user() ?? null;

        if(!$user) {
            return $this->sendError('Bạn cần đăng nhập để gửi đánh giá.' , 401);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:2000',
        ]);

        $review = ProductReview::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($review) {
            $review->update([
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);
            $message = 'Cập nhật đánh giá thành công.';
        } else {
            $review = ProductReview::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);
            $message = 'Gửi đánh giá thành công.';
        }

        $createdComment = null;
        if (!empty($request->comment)) {
            $createdComment = ProductComment::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'content' => $request->comment,
                'parent_id' => null,
            ]);
        }

        return $this->sendSuccess([
            'review' => $review->load('user:id,name'),
            'comment' => $createdComment ? $createdComment->load('user:id,name') : null,
        ], $message);
    }

    public function indexComments($productId)
    {
        $comments = ProductComment::with(['user:id,name', 'replies.user:id,name', 'likes'])
            ->where('product_id', $productId)
            ->whereNull('parent_id')
            ->latest()
            ->paginate(10);

    return $this->sendSuccess($comments);
    }

    public function storeComment(Request $request, $productId)
    {
        $user = auth()->user() ?? null;

        if(!$user) {
            return $this->sendError('Bạn cần đăng nhập để gửi bình luận.', 401);
        }

        $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:product_comments,id',
        ]);

        $comment = ProductComment::create([
            'user_id' => $user->id,
            'product_id' => $productId,
            'content' => $request->content,
            'parent_id' => $request->parent_id,
        ]);

        return $this->created(['comment' => $comment->load('user:id,name')], 'Gửi bình luận thành công.');
    }

    public function toggleCommentLike(Request $request, $commentId)
    {
        $user = auth()->user() ?? null;

        $like = CommentLike::where('user_id', $user->id)
            ->where('comment_id', $commentId)
            ->first();

        if ($like) {
            $like->delete();
            $message = 'Unlike bình luận thành công.';
            $action = 'unliked';
        } else {
            CommentLike::create([
                'user_id' => $user->id,
                'comment_id' => $commentId,
            ]);
            $message = 'Like bình luận thành công.';
            $action = 'liked';
        }

        $totalLikes = CommentLike::where('comment_id', $commentId)->count();

        return $this->sendSuccess([
            'action' => $action,
            'total_likes' => $totalLikes,
        ], $message);
    }

    public function deleteComment($commentId)
    {
        $user = auth()->user() ?? null;

        $comment = ProductComment::where('id', $commentId)
            ->where('user_id', $user->id)
            ->first();

        if (!$comment) {
            return $this->sendError('Bình luận không tồn tại hoặc bạn không có quyền xóa.', 404);
        }

        // Delete all replies associated with this comment
        ProductComment::where('parent_id', $commentId)->delete();

        // Delete the comment itself
        $comment->delete();

        $message = 'Xóa bình luận thành công.';
        $totalLikes = CommentLike::where('comment_id', $commentId)->count();

        return $this->sendSuccess([
            'total_likes' => $totalLikes,
        ], $message);
    }
}
