import React from "react";

const WarrantyPolicyPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 sm:p-8">
        <p className="text-sm text-gray-500">Trung tâm hỗ trợ</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">
          Chính sách bảo hành
        </h1>
        <p className="mt-3 text-gray-700 leading-relaxed max-w-3xl">
            Thông tin bảo hành được trình bày theo kiểu “dễ đọc – dễ làm”.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Gửi yêu cầu bảo hành
          </a>
          {/* <a
            href="/order-history"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Tra cứu đơn hàng
          </a> */}
        </div>
      </div>

      {/* Coverage cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Phạm vi</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Lỗi NSX</p>
          <p className="mt-2 text-sm text-gray-700">
            Hỗ trợ các lỗi phần cứng do nhà sản xuất (theo điều kiện áp dụng).
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Thời gian xử lý</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">3–7 ngày</p>
          <p className="mt-2 text-sm text-gray-700">
            Tuỳ tình trạng linh kiện & mức độ lỗi. Sẽ có thông báo tiến độ.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Theo dõi</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Minh bạch</p>
          <p className="mt-2 text-sm text-gray-700">
            Tiếp nhận → kiểm định → báo phương án → hoàn tất.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Điều kiện bảo hành</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0" />
                Sản phẩm còn trong thời hạn bảo hành và có thông tin mua hàng.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0" />
                Tem/serial (nếu có) rõ ràng, không bị tẩy xoá.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-gray-900 flex-shrink-0" />
                Lỗi phát sinh từ nhà sản xuất (không do tác động bên ngoài).
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Trường hợp từ chối</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Rơi vỡ, móp méo, cong sườn",
                "Vào nước / ẩm mốc",
                "Can thiệp phần cứng tại nơi khác",
                "Mất tem/serial/niêm phong",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Quy trình bảo hành</h2>
            <ol className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Tiếp nhận", desc: "Ghi nhận tình trạng + kiểm tra thông tin mua hàng" },
                { title: "Kiểm định", desc: "Kỹ thuật kiểm tra và xác định nguyên nhân lỗi" },
                { title: "Báo phương án", desc: "Thông báo sửa/đổi/hoàn theo chính sách" },
                { title: "Bàn giao", desc: "Hoàn tất và cập nhật trạng thái cho khách" },
              ].map((s, idx) => (
                <li key={s.title} className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-xs text-gray-500">Bước {idx + 1}</p>
                  <p className="mt-1 font-semibold text-gray-900">{s.title}</p>
                  <p className="mt-1 text-sm text-gray-700">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900">Hỗ trợ bảo hành</h3>
            <p className="mt-2 text-sm text-gray-700">
              Chuẩn bị sẵn số điện thoại + mã đơn hàng để tụi mình hỗ trợ nhanh hơn.
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
            <h3 className="text-base font-semibold text-gray-900">Mẹo nhanh</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• Sao lưu dữ liệu trước khi gửi bảo hành</li>
              <li>• Gỡ tài khoản iCloud/Google (nếu cần kiểm định)</li>
              <li>• Mang kèm phụ kiện (tuỳ trường hợp)</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WarrantyPolicyPage;
