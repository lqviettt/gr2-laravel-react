import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useBreadcrumb } from "../../../component/BreadcrumbContext";

const SwapPolicyPage = () => {
    const { setBreadcrumbTrail } = useBreadcrumb();
  
  const faqs = useMemo(
    () => [
      {
        q: "Thời gian đổi trả là bao lâu?",
        a: "Bạn có thể đổi trả trong 07 ngày kể từ ngày nhận hàng (tùy điều kiện sản phẩm). Một số nhóm hàng có thể áp dụng thời gian khác.",
      },
      {
        q: "Điều kiện đổi trả hợp lệ là gì?",
        a: "Sản phẩm còn nguyên tem/niêm phong (nếu có), đầy đủ phụ kiện/hoá đơn, không có dấu hiệu rơi vỡ/va đập/ẩm nước, và đáp ứng tiêu chí kiểm định của cửa hàng.",
      },
      {
        q: "Có mất phí đổi trả không?",
        a: "Nếu lỗi do nhà sản xuất/nhà bán, bạn sẽ được hỗ trợ đổi mới/hoàn tiền theo chính sách. Nếu đổi trả theo nhu cầu cá nhân, có thể phát sinh phí xử lý/khấu hao tuỳ tình trạng sản phẩm.",
      },
      {
        q: "Lên đời (trade-in) hoạt động như thế nào?",
        a: "Bạn mang máy cũ đến cửa hàng (hoặc gửi kiểm định). Chúng tôi định giá theo tình trạng máy, sau đó trừ trực tiếp vào giá sản phẩm mới.",
      },
    ],
    []
  );

    useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setBreadcrumbTrail([
        { name: "Chính sách đổi trả, lên đời", path: "/swap-policy" },
      ]);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 sm:p-8">
        <p className="text-sm text-gray-500">Hỗ trợ khách hàng</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">
          Chính sách đổi trả, lên đời
        </h1>
        <p className="mt-3 text-gray-700 leading-relaxed max-w-3xl">
          Tụi mình thiết kế chính sách rõ ràng, dễ hiểu để bạn yên tâm mua sắm. Dưới
          đây là các điều kiện cơ bản và quy trình xử lý đổi trả/lên đời.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Liên hệ hỗ trợ
          </a>
          {/* <a
            href="/order-history"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Tra cứu đơn hàng
          </a> */}
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Đổi trả nhanh</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">07 ngày</p>
          <p className="mt-2 text-sm text-gray-700">
            Áp dụng cho sản phẩm đủ điều kiện và còn nguyên vẹn.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Lên đời</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Trừ thẳng vào giá</p>
          <p className="mt-2 text-sm text-gray-700">
            Định giá theo tình trạng máy, minh bạch trước khi chốt.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Xử lý</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Rõ ràng từng bước</p>
          <p className="mt-2 text-sm text-gray-700">
            Tiếp nhận → kiểm định → xác nhận → hoàn tất.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Điều kiện đổi trả cơ bản
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0" />
                Sản phẩm còn nguyên vẹn, không trầy xước nặng, không vào nước.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0" />
                Đầy đủ phụ kiện, hộp (nếu có), hoá đơn/phiếu mua hàng.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0" />
                Không thuộc trường hợp từ chối đổi trả (rơi vỡ, tự ý sửa chữa…).
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Câu hỏi thường gặp</h2>

            <div className="mt-4 divide-y divide-gray-100">
              {faqs.map((item, idx) => {
                const isOpen = idx === openIndex;
                return (
                  <div key={idx} className="py-4">
                    <button
                      type="button"
                      className="w-full text-left flex items-start justify-between gap-4"
                      onClick={() => setOpenIndex((cur) => (cur === idx ? -1 : idx))}
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium text-gray-900">{item.q}</span>
                      <span
                        className={`mt-1 text-gray-500 transition-transform ${
                          isOpen ? "rotate-45" : ""
                        }`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900">Cần hỗ trợ nhanh?</h3>
            <p className="mt-2 text-sm text-gray-700">
              Nhắn cho tụi mình để được tư vấn đổi trả/lên đời theo tình trạng sản phẩm.
            </p>
            <div className="mt-4 space-y-2">
              <a
                href="tel:0981218907"
                className="block rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 text-center"
              >
                Gọi hotline: 0981 218 907
              </a>
              <a
                href="/contact"
                className="block rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 text-center"
              >
                Gửi form liên hệ
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900">Quy trình xử lý</h3>
            <ol className="mt-3 space-y-2 text-sm text-gray-700 list-decimal pl-4">
              <li>Tiếp nhận yêu cầu + thông tin đơn hàng</li>
              <li>Kiểm định tình trạng sản phẩm</li>
              <li>Xác nhận phương án đổi/hoàn/lên đời</li>
              <li>Hoàn tất & cập nhật trạng thái</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SwapPolicyPage;
