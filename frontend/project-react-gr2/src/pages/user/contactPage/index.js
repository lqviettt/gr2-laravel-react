import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useBreadcrumb } from "../../../component/BreadcrumbContext";

const ContactPage = () => {
    const { setBreadcrumbTrail } = useBreadcrumb();

    useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setBreadcrumbTrail([{ name: "Liên hệ", path: "/contact" }]);
    }

    return () => {
      isMounted = false;
    };
  }, []);
  
  const subjectOptions = useMemo(
    () => [
      { value: "order", label: "Hỗ trợ đơn hàng" },
      { value: "warranty", label: "Bảo hành / kỹ thuật" },
      { value: "swap", label: "Đổi trả / lên đời" },
      { value: "product", label: "Tư vấn sản phẩm" },
      { value: "other", label: "Khác" },
    ],
    []
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "order",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Vui lòng nhập họ tên.";
    if (!form.email.trim()) next.email = "Vui lòng nhập email.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Email không hợp lệ.";
    }
    if (!form.phone.trim()) next.phone = "Vui lòng nhập số điện thoại.";
    if (!form.message.trim()) next.message = "Vui lòng nhập nội dung.";
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    // Placeholder submit: integrate API when available.
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
      setForm({ fullName: "", email: "", phone: "", subject: "order", message: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 sm:p-8">
        <p className="text-sm text-gray-500">Hỗ trợ khách hàng</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">Liên hệ</h1>
        <p className="mt-3 text-gray-700 leading-relaxed max-w-3xl">
          Gửi thông tin để tụi mình hỗ trợ nhanh nhất. Bạn cũng có thể gọi hotline hoặc
          ghé cửa hàng trong giờ làm việc.
        </p>
      </div>

      {/* Info cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Hotline</p>
          <a className="mt-1 block text-lg font-semibold text-gray-900" href="tel:0981218907">
            0981 218 907
          </a>
          <p className="mt-2 text-sm text-gray-700">Hỗ trợ nhanh: đơn hàng, bảo hành.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Email</p>
          <a className="mt-1 block text-lg font-semibold text-gray-900" href="mailto:lqviettt3403@gmail.com">
            lqviettt3403@gmail.com
          </a>
          <p className="mt-2 text-sm text-gray-700">Tiếp nhận yêu cầu & phản hồi theo ticket.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Địa chỉ</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Hệ thống cửa hàng</p>
          <p className="mt-2 text-sm text-gray-700">Cập nhật địa chỉ cửa hàng tại đây.</p>
        </div>
      </div>

      {/* Form + sidebar */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Gửi yêu cầu</h2>
          <p className="mt-2 text-sm text-gray-700">
            Điền form bên dưới. Tụi mình sẽ liên hệ lại sớm nhất.
          </p>

          {submitted && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              Đã gửi yêu cầu thành công. Tụi mình sẽ phản hồi sớm!
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900" htmlFor="fullName">
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={onChange("fullName")}
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 ${
                    errors.fullName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={onChange("phone")}
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="0981 218 907"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="email@domain.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900" htmlFor="subject">
                  Chủ đề
                </label>
                <select
                  id="subject"
                  value={form.subject}
                  onChange={onChange("subject")}
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  {subjectOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900" htmlFor="message">
                Nội dung
              </label>
              <textarea
                id="message"
                value={form.message}
                onChange={onChange("message")}
                rows={6}
                className={`mt-2 w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 ${
                  errors.message ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Mô tả vấn đề, mã đơn hàng (nếu có), thời gian bạn có thể nhận cuộc gọi..."
              />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
              </button>
              <a
                href="/warranty-policy"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Xem chính sách bảo hành
              </a>
            </div>

            {/* <p className="text-xs text-gray-500">
              Ghi chú: Đây là form UI mẫu (chưa gọi API thật). Nếu bạn muốn lưu yêu cầu
              về backend, mình có thể nối API tương ứng.
            </p> */}
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900">Giờ làm việc</h3>
            <dl className="mt-3 space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <dt>Thứ 2 - Thứ 7</dt>
                <dd className="font-medium text-gray-900">09:00 - 21:00</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Chủ nhật</dt>
                <dd className="font-medium text-gray-900">09:00 - 18:00</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900">Bản đồ</h3>
            <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <div className="h-full w-full grid place-items-center">
                <p className="text-sm text-gray-500">Map placeholder (Google Maps/Embed)</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ContactPage;
