import { memo, useState, useEffect } from "react";
import { FaStar, FaThumbsUp, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { api } from "../../../utils/apiClient";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const ReviewsFeed = ({
  productId,
  reviewsData,
  onReviewsChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsData, setCommentsData] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [replyVisible, setReplyVisible] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [expandedAllComments, setExpandedAllComments] = useState(false);

  // Helper to get current user ID from JWT token
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.sub || payload.id || payload.user_id || null;
    } catch (e) {
      return null;
    }
  };

  const isUserLoggedIn = () => {
    return localStorage.getItem("isLoggedIn") === "true" || !!getCurrentUserId();
  };

  const currentUserId = getCurrentUserId();

  // Format relative time using dayjs
  const formatRelativeTime = (date) => {
    try {
      return dayjs(date).fromNow();
    } catch (e) {
      try {
        return new Date(date).toLocaleString();
      } catch (e2) {
        return date;
      }
    }
  };

  // Fetch comments with pagination
  const fetchComments = async (page = 1) => {
    try {
      const resp = await api.get(`/product/${productId}/comments?page=${page}`, {
        skipCache: true,
      });
      const payload = resp.data?.data;
      if (!payload) return;

      if (page === 1) {
        setCommentsData(payload);
      } else {
        // Append new comments for load-more
        setCommentsData((prev) => ({
          ...prev,
          data: [...(prev?.data || []), ...(payload.data || [])],
          current_page: payload.current_page,
          last_page: payload.last_page,
        }));
      }

      // Check if there are more pages
      setHasMorePages(payload.current_page < payload.last_page);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Lỗi tải bình luận");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (productId) {
      fetchComments(1);
    }
  }, [productId]);

  // Refresh comments when reviewsData changes (after new review submitted)
  useEffect(() => {
    if (reviewsData) {
      setCurrentPage(1);
      fetchComments(1);
    }
  }, [reviewsData]);

  // Build unified activity feed
  const buildActivityFeed = () => {
    const items = [];

    // Build review->comment mapping
    const reviewMap = new Map();
    if (reviewsData && Array.isArray(reviewsData.data)) {
      reviewsData.data.forEach((r) => {
        if (r.comment && r.user?.id) {
          const key = `${r.user.id}::${String(r.comment).trim()}`;
          reviewMap.set(key, r.rating || 0);
        }
      });
    }

    // Build feed from comments
    if (commentsData && Array.isArray(commentsData.data)) {
      commentsData.data.forEach((c) => {
        const key = `${c.user?.id}::${String(c.content || "").trim()}`;
        const rating = reviewMap.has(key) ? reviewMap.get(key) : undefined;

        const likesArr = c.likes || [];
        const likesCount = Array.isArray(likesArr) ? likesArr.length : 0;
        const liked = currentUserId
          ? likesArr.some(
              (l) => (l.user_id || (l.user && l.user.id)) == currentUserId
            )
          : false;

        items.push({
          key: `comment-${c.id}`,
          type: "comment",
          id: c.id,
          user: c.user,
          content: c.content || "",
          likes: likesCount,
          replies: c.replies || [],
          created_at: c.created_at,
          rating,
          liked,
        });
      });
    }

    // Sort by created_at desc
    items.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return items;
  };

  const submitComment = async (content, parentId = null) => {
    if (!isUserLoggedIn()) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    if (!content || !content.trim()) {
      toast.error("Nội dung bình luận không được để trống");
      return;
    }

    try {
      const resp = await api.post(`/product/${productId}/comments`, {
        content,
        parent_id: parentId,
      });

      if(resp.data?.status !== 200) {
        toast.error(resp.data?.error || "Gửi đánh giá thất bại");
        return;
      }
      
      toast.success(resp.data?.message || "Gửi bình luận thành công");

      // Clear reply input
      if (parentId) {
        setReplyInputs((s) => ({ ...s, [parentId]: "" }));
        setReplyVisible((s) => ({ ...s, [parentId]: false }));
      }

      // Refresh comments
      setCurrentPage(1);
      fetchComments(1);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Gửi bình luận thất bại");
    }
  };

  const toggleCommentLike = async (commentId) => {
    if (!isUserLoggedIn()) {
      toast.error("Vui lòng đăng nhập để thích bình luận");
      return;
    }

    try {
      const resp = await api.post(`/comments/${commentId}/like`);
      toast.success(resp.data?.message || "Đã cập nhật like");

      // Refresh comments to get updated likes
      setCurrentPage(1);
      fetchComments(1);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Lỗi");
    }
  };

  const deleteComment = async (commentId) => {
    if (!isUserLoggedIn()) {
      toast.error("Vui lòng đăng nhập để xóa bình luận");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      return;
    }

    try {
      const resp = await api.delete(`/comments/${commentId}`);
      toast.success(resp.data?.message || "Xóa bình luận thành công");

      // Refresh comments
      setCurrentPage(1);
      fetchComments(1);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Lỗi xóa bình luận");
    }
  };

  const handleLoadMore = () => {
    const nextPage = (commentsData?.current_page || 1) + 1;
    setIsLoadingMore(true);
    setCurrentPage(nextPage);
    fetchComments(nextPage);
  };

  const activityFeed = buildActivityFeed();

  return (
    <div className="mt-6 pt-4">
      <h3 className="font-semibold mb-3">Hoạt động (Đánh giá & Bình luận)</h3>

      <div className="mb-4">
        <div className="text-sm text-gray-600">
          Để bình luận, vui lòng gửi đánh giá kèm nội dung ở phần "Viết đánh giá"
          phía trên. Sau khi gửi, người khác có thể thích và trả lời bình luận của
          bạn.
        </div>
      </div>

      <div className="space-y-4">
        {activityFeed && activityFeed.length > 0 ? (
          <>
            {activityFeed.map((item) => (
              <div key={item.key} className="border rounded p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                    {item.user?.name
                      ? item.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                      : "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-sm">
                          {item.user?.name || "Khách"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatRelativeTime(item.created_at)}
                        </div>
                      </div>
                      {item.user?.id === currentUserId || String(item.user?.id) === String(currentUserId) ? (
                        <button
                          onClick={() => deleteComment(item.id)}
                          className="p-1"
                          title="Xóa bình luận"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-2">
                      {item.rating && (
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <FaStar
                              key={i}
                              className={`mr-1 text-sm ${
                                i <= item.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <div className="text-sm text-gray-700">{item.content}</div>

                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <button
                          onClick={() => toggleCommentLike(item.id)}
                          disabled={!isUserLoggedIn()}
                          className={`flex items-center gap-2 font-medium ${
                            !isUserLoggedIn() ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                          } transition-colors`}
                        >
                          <FaThumbsUp
                            className={`text-lg ${
                              item.liked ? "text-blue" : "text-gray-300"
                            }`}
                          />
                          <span className={item.liked ? "text-blue" : "text-gray-600"}>
                            {item.likes}
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            setReplyVisible((s) => ({
                              ...s,
                              [item.id]: !s[item.id],
                            }))
                          }
                          disabled={!isUserLoggedIn()}
                          className={`font-medium transition-colors ${
                            !isUserLoggedIn()
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-600 hover:text-blue-600 cursor-pointer"
                          }`}
                        >
                          Trả lời
                        </button>
                      </div>

                      {/* Replies Section */}
                      {item.replies && item.replies.length > 0 && (
                        <div className="mt-3">
                          <button
                            onClick={() => {
                              setExpandedReplies((s) => ({
                                ...s,
                                [item.id]: !s[item.id],
                              }));
                            }}
                            type="button"
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 mb-2"
                          >
                            {expandedReplies[item.id] ? (
                              <>
                                <FaChevronUp className="text-xs" />
                                Thu gọn
                              </>
                            ) : (
                              <>
                                <FaChevronDown className="text-xs" />
                                Xem tất cả {item.replies.length} phản hồi
                              </>
                            )}
                          </button>

                          {expandedReplies[item.id] && (
                            <div className="space-y-3 mt-2 mb-2">
                              {item.replies.map((r) => (
                                <div key={r.id} className="pl-4">
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                                      {r.user?.name
                                        ? r.user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join("")
                                        : "U"}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className="text-sm font-semibold">
                                          {r.user?.name || "Khách"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {formatRelativeTime(r.created_at)}
                                        </div>
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        {r.content}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reply input (initially hidden) */}
                {item.type !== "reply" && replyVisible[item.id] && (
                  <div className="mt-3 pl-12">
                    <textarea
                      value={replyInputs[item.id] || ""}
                      onChange={(e) =>
                        setReplyInputs((s) => ({
                          ...s,
                          [item.id]: e.target.value,
                        }))
                      }
                      placeholder="Viết trả lời"
                      className="w-full border rounded p-2 mb-2"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          submitComment(replyInputs[item.id] || "", item.id)
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Gửi
                      </button>
                      <button
                        onClick={() =>
                          setReplyVisible((s) => ({ ...s, [item.id]: false }))
                        }
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Load more comments from backend */}
            {hasMorePages && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? "Đang tải..." : "Tải thêm bình luận"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-600">Chưa có hoạt động nào.</div>
        )}
      </div>
    </div>
  );
};

export default memo(ReviewsFeed);
