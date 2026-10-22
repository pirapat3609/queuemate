
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  LogOut,
  Scissors,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Check,
  Search,
  ListFilter,
  RotateCcw,
  Banknote,
  TrendingUp,
  Settings,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { supabase } from "@/lib/supabase";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

type Booking = {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_id: string;
  barber_id: string;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  price_at_booking: number | null;
  completed_at: string | null;
};

type Service = {
  id: string;
  name: string;
  price: number;
};

type Barber = {
  id: string;
  name: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingBookingId, setUpdatingBookingId] =
    useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [reportPeriod, setReportPeriod] = useState<"today" | "week" | "month">("month");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData.user) {
      router.replace("/login");
      return;
    }

    setEmail(authData.user.email ?? "");

    const [
      { data: bookingData, error: bookingError },
      { data: serviceData, error: serviceError },
      { data: barberData, error: barberError },
    ] = await Promise.all([
      supabase
        .from("bookings")
        .select(
          "id, customer_name, customer_phone, service_id, barber_id, start_at, end_at, status, price_at_booking, completed_at"
        )
        .order("start_at", { ascending: true }),
      supabase.from("services").select("id, name, price"),
      supabase.from("barbers").select("id, name"),
    ]);

    if (bookingError) {
      setError(
        "ไม่สามารถโหลดรายการจองได้ กรุณาตรวจสอบสิทธิ์ RLS ใน Supabase"
      );
    } else {
      setBookings((bookingData ?? []) as Booking[]);
    }

    if (serviceError || barberError) {
      setError((current) =>
        current ||
        "โหลดข้อมูลบริการหรือช่างไม่สำเร็จ กรุณาลองรีเฟรช"
      );
    }

    setServices((serviceData ?? []) as Service[]);
    setBarbers((barberData ?? []) as Barber[]);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    async function initialize() {
      await loadDashboard();
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  async function handleStatusChange(
    bookingId: string,
    newStatus: "confirmed" | "completed" | "cancelled"
  ) {
    const labels = {
      confirmed: "ยืนยันคิว",
      completed: "ทำเครื่องหมายว่าเสร็จสิ้น",
      cancelled: "ยกเลิกคิว",
    };

    const confirmed = window.confirm(
      `คุณต้องการ${labels[newStatus]}ใช่หรือไม่?`
    );

    if (!confirmed) return;

    setUpdatingBookingId(bookingId);
    setActionMessage("");
    setActionError("");

    try {
      const { data, error: rpcError } = await supabase.rpc(
        "update_booking_status",
        {
          p_booking_id: bookingId,
          p_new_status: newStatus,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      if (data !== true) {
        throw new Error("ไม่สามารถยืนยันการเปลี่ยนสถานะได้");
      }

      setActionMessage(`อัปเดตสถานะเป็น "${labels[newStatus]}" สำเร็จ`);

      await loadDashboard();
    } catch (err) {
      console.error("Update booking status error:", err);

      setActionError(
        err instanceof Error
          ? err.message
          : "เปลี่ยนสถานะไม่สำเร็จ กรุณาลองอีกครั้ง"
      );
    } finally {
      setUpdatingBookingId(null);
    }
  }

  function getServiceName(id: string) {
    return (
      services.find((item) => item.id === id)?.name ??
      "ไม่พบข้อมูลบริการ"
    );
  }

  function getBarberName(id: string) {
    return (
      barbers.find((item) => item.id === id)?.name ??
      "ไม่พบข้อมูลช่าง"
    );
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString("th-TH", {
      dateStyle: "medium",
      timeZone: "Asia/Bangkok",
    });
  }

  function formatTime(value: string) {
    return new Date(value).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Bangkok",
    });
  }

  const filteredBookings = bookings.filter((booking) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !search ||
      booking.customer_name.toLowerCase().includes(search) ||
      booking.customer_phone.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    const bookingDate = new Date(booking.start_at).toLocaleDateString("en-CA", {
      timeZone: "Asia/Bangkok",
    });
    const matchesDate = !dateFilter || bookingDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  // ใช้วันที่ตามเขตเวลาไทย (Asia/Bangkok) สำหรับสรุปรายได้
  function getBangkokDateKey(value: string | Date) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(value));

    const year = parts.find((part) => part.type === "year")?.value ?? "";
    const month = parts.find((part) => part.type === "month")?.value ?? "";
    const day = parts.find((part) => part.type === "day")?.value ?? "";
    return `${year}-${month}-${day}`;
  }

  const todayKey = getBangkokDateKey(new Date());
  const [todayYear, todayMonth, todayDay] = todayKey.split("-").map(Number);
  const todayUtc = new Date(Date.UTC(todayYear, todayMonth - 1, todayDay));
  const weekdayFromMonday = (todayUtc.getUTCDay() + 6) % 7;
  const weekStartUtc = new Date(todayUtc);
  weekStartUtc.setUTCDate(todayUtc.getUTCDate() - weekdayFromMonday);
  const weekStartKey = weekStartUtc.toISOString().slice(0, 10);
  const monthStartKey = `${todayYear}-${String(todayMonth).padStart(2, "0")}-01`;

  const reportStartKey =
    reportPeriod === "today"
      ? todayKey
      : reportPeriod === "week"
        ? weekStartKey
        : monthStartKey;

  const completedBookingsInPeriod = bookings.filter((booking) => {
    if (booking.status !== "completed") return false;
    if (!booking.completed_at) return false;
    const completedDate = getBangkokDateKey(booking.completed_at);
    return completedDate >= reportStartKey && completedDate <= todayKey;
  });

  const reportRevenue = completedBookingsInPeriod.reduce((total, booking) => {
    return total + Number(booking.price_at_booking ?? 0);
  }, 0);

  // เตรียมข้อมูลกราฟรายได้รายวันตามช่วงเวลาที่เลือก
  const dailyRevenueMap = new Map<string, number>();
  const dailyBookingMap = new Map<string, number>();
  for (const booking of completedBookingsInPeriod) {
    if (!booking.completed_at) continue;
    const dateKey = getBangkokDateKey(booking.completed_at);
    dailyRevenueMap.set(
      dateKey,
      (dailyRevenueMap.get(dateKey) ?? 0) + Number(booking.price_at_booking ?? 0)
    );
    dailyBookingMap.set(dateKey, (dailyBookingMap.get(dateKey) ?? 0) + 1);
  }

  const chartStartDate = new Date(`${reportStartKey}T00:00:00+07:00`);
  const chartEndDate = new Date(`${todayKey}T00:00:00+07:00`);
  const revenueChartData: { date: string; revenue: number; bookings: number }[] = [];
  for (
    let cursor = new Date(chartStartDate);
    cursor <= chartEndDate;
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  ) {
    const dateKey = getBangkokDateKey(cursor);
    revenueChartData.push({
      date: dateKey.slice(5),
      revenue: dailyRevenueMap.get(dateKey) ?? 0,
      bookings: dailyBookingMap.get(dateKey) ?? 0,
    });
  }

  const bookingStatusChartData = [
    { name: "รอยืนยัน", value: pendingCount, color: "#f59e0b" },
    { name: "ยืนยันแล้ว", value: confirmedCount, color: "#3b82f6" },
    { name: "เสร็จสิ้น", value: completedCount, color: "#10b981" },
    {
      name: "ยกเลิก",
      value: bookings.filter((booking) => booking.status === "cancelled").length,
      color: "#ef4444",
    },
  ];

  const popularServicesMap = new Map<string, number>();
  for (const booking of bookings) {
    if (booking.status === "cancelled") continue;
    const serviceName = getServiceName(booking.service_id);
    popularServicesMap.set(serviceName, (popularServicesMap.get(serviceName) ?? 0) + 1);
  }
  const popularServicesChartData = Array.from(popularServicesMap.entries())
    .map(([name, bookingsCount]) => ({ name, bookings: bookingsCount }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  const reportPeriodLabels = {
    today: "วันนี้",
    week: "สัปดาห์นี้",
    month: "เดือนนี้",
  };

  const statusLabels: Record<BookingStatus, string> = {
    pending: "รอยืนยัน",
    confirmed: "ยืนยันแล้ว",
    completed: "เสร็จสิ้น",
    cancelled: "ยกเลิก",
  };

  const statusStyles: Record<BookingStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <Scissors size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                QueueMate{" "}
                <span className="text-blue-600">Admin</span>
              </h1>
              <p className="text-xs text-slate-500">
                ระบบจัดการคิวร้านบริการ
              </p>
            </div>
          </div>

          <button
              type="button"
              onClick={() => router.push("/admin/services")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Settings size={17} />
              จัดการบริการ
            </button>

            <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            <LogOut size={17} />
            ออกจากระบบ
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Admin Dashboard
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            จัดการรายการจอง
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            เข้าสู่ระบบด้วย {email}
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: "รอยืนยัน",
              value: pendingCount,
              color: "text-amber-600",
            },
            {
              label: "ยืนยันแล้ว",
              value: confirmedCount,
              color: "text-blue-600",
            },
            {
              label: "เสร็จสิ้น",
              value: completedCount,
              color: "text-emerald-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <p className="text-sm text-slate-500">
                {item.label}
              </p>
              <p
                className={`mt-3 text-3xl font-bold ${item.color}`}
              >
                {loading ? "—" : item.value}
              </p>
            </div>
          ))}
        </div>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold">สรุปรายได้ของร้าน</h3>
              <p className="mt-1 text-sm text-slate-500">
                นับเฉพาะรายการจองที่มีสถานะเสร็จสิ้น
              </p>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
              ช่วงเวลา
              <select
                value={reportPeriod}
                onChange={(event) =>
                  setReportPeriod(event.target.value as "today" | "week" | "month")
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="today">วันนี้</option>
                <option value="week">สัปดาห์นี้</option>
                <option value="month">เดือนนี้</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-emerald-800">
                  รายได้โดยประมาณ · {reportPeriodLabels[reportPeriod]}
                </p>
                <Banknote className="text-emerald-700" size={22} />
              </div>
              <p className="mt-3 text-3xl font-bold text-emerald-700">
                {loading
                  ? "—"
                  : `${reportRevenue.toLocaleString("th-TH")} บาท`}
              </p>
              <p className="mt-2 text-xs text-emerald-800">
                คำนวณจากราคาบริการปัจจุบันของคิวที่เสร็จสิ้น
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-blue-800">
                  จำนวนคิวที่เสร็จสิ้น · {reportPeriodLabels[reportPeriod]}
                </p>
                <TrendingUp className="text-blue-700" size={22} />
              </div>
              <p className="mt-3 text-3xl font-bold text-blue-700">
                {loading ? "—" : completedBookingsInPeriod.length.toLocaleString("th-TH")} คิว
              </p>
              <p className="mt-2 text-xs text-blue-800">
                นับตามวันที่เริ่มให้บริการในเขตเวลาไทย
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-2">
            <div className="mb-5">
              <h3 className="text-lg font-bold">กราฟรายได้รายวัน</h3>
              <p className="mt-1 text-sm text-slate-500">
                แสดงรายได้จากคิวที่เสร็จสิ้น · {reportPeriodLabels[reportPeriod]}
              </p>
            </div>
            {loading ? (
              <div className="flex h-72 items-center justify-center text-sm text-slate-400">กำลังโหลดกราฟ...</div>
            ) : revenueChartData.length === 0 ? (
              <div className="flex h-72 items-center justify-center text-sm text-slate-400">ยังไม่มีข้อมูลรายได้ในช่วงเวลานี้</div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueChartData} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [`${Number(value ?? 0).toLocaleString("th-TH")} บาท`, "รายได้"]}
                      labelFormatter={(label) => `วันที่ ${label}`}
                    />
                    <Line type="monotone" dataKey="revenue" name="รายได้" stroke="#059669" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-bold">สัดส่วนสถานะการจอง</h3>
            <p className="mt-1 text-sm text-slate-500">รายการจองทั้งหมดที่โหลดจากระบบ</p>
            {loading ? (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">กำลังโหลดกราฟ...</div>
            ) : bookings.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">ยังไม่มีข้อมูลการจอง</div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={bookingStatusChartData} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={82} label>
                      {bookingStatusChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${Number(value ?? 0)} คิว`, "จำนวน"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-bold">บริการยอดนิยม</h3>
            <p className="mt-1 text-sm text-slate-500">จัดอันดับตามจำนวนคิว ไม่รวมรายการที่ยกเลิก (สูงสุด 5 บริการ)</p>
            {loading ? (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">กำลังโหลดกราฟ...</div>
            ) : popularServicesChartData.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">ยังไม่มีข้อมูลบริการ</div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularServicesChartData} margin={{ top: 10, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${Number(value ?? 0)} คิว`, "จำนวนจอง"]} />
                    <Bar dataKey="bookings" name="จำนวนจอง" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        {actionMessage && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle2 className="mr-2 inline" size={18} />
            {actionMessage}
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <XCircle className="mr-2 inline" size={18} />
            {actionError}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="font-bold">รายการจองทั้งหมด</h3>
              <p className="mt-1 text-sm text-slate-500">
                ตรวจสอบวัน เวลา และจัดการสถานะคิว
              </p>
            </div>

            <button
              onClick={loadDashboard}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              รีเฟรช
            </button>
          </div>

          <div className="grid gap-3 border-b border-slate-200 bg-slate-50/70 p-5 md:grid-cols-4">
            <div className="md:col-span-2">
              <label htmlFor="booking-search" className="mb-2 block text-sm font-medium text-slate-700">
                ค้นหาลูกค้า
              </label>
              <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="booking-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="ชื่อหรือเบอร์โทรศัพท์"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="booking-status" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <ListFilter size={16} />
                สถานะ
              </label>
              <select
                id="booking-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "all" | BookingStatus)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="pending">รอยืนยัน</option>
                <option value="confirmed">ยืนยันแล้ว</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>

            <div>
              <label htmlFor="booking-date" className="mb-2 block text-sm font-medium text-slate-700">
                วันที่จอง
              </label>
              <input
                id="booking-date"
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-4">
              <p className="text-sm text-slate-500">
                แสดง <span className="font-semibold text-slate-900">{filteredBookings.length}</span> จาก {bookings.length} รายการ
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("");
                }}
                disabled={!searchTerm && statusFilter === "all" && !dateFilter}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={15} />
                ล้างตัวกรอง
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              กำลังโหลดข้อมูล...
            </div>
          ) : error ? (
            <div className="m-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarDays
                size={36}
                className="mx-auto mb-3 text-slate-300"
              />
              <p className="font-medium">
                ยังไม่มีรายการจองให้แสดง
              </p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Search size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="font-medium">ไม่พบรายการจองที่ตรงกัน</p>
              <p className="mt-1 text-sm text-slate-500">
                ลองเปลี่ยนคำค้นหา สถานะ หรือวันที่ที่เลือก
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">ลูกค้า</th>
                    <th className="px-5 py-4 font-medium">บริการ</th>
                    <th className="px-5 py-4 font-medium">ช่าง</th>
                    <th className="px-5 py-4 font-medium">วันที่</th>
                    <th className="px-5 py-4 font-medium">เวลา</th>
                    <th className="px-5 py-4 font-medium">สถานะ</th>
                    <th className="px-5 py-4 font-medium">จัดการคิว</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((booking) => {
                    const isUpdating =
                      updatingBookingId === booking.id;

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {booking.customer_name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {booking.customer_phone}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium">
                            {getServiceName(booking.service_id)}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-emerald-700">
                            {booking.price_at_booking === null
                              ? "ไม่พบราคา"
                              : `${Number(booking.price_at_booking).toLocaleString("th-TH")} บาท`}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {getBarberName(booking.barber_id)}
                        </td>

                        <td className="px-5 py-4">
                          {formatDate(booking.start_at)}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={14} />
                            {formatTime(booking.start_at)} –{" "}
                            {formatTime(booking.end_at)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyles[booking.status]}`}
                          >
                            {statusLabels[booking.status]}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {booking.status === "pending" && (
                            <div className="flex flex-wrap gap-2">
                              <button
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusChange(
                                    booking.id,
                                    "confirmed"
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                              >
                                <Check size={14} />
                                {isUpdating ? "กำลังบันทึก..." : "ยืนยันคิว"}
                              </button>

                              <button
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusChange(
                                    booking.id,
                                    "cancelled"
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                              >
                                <XCircle size={14} />
                                ยกเลิก
                              </button>
                            </div>
                          )}

                          {booking.status === "confirmed" && (
                            <div className="flex flex-wrap gap-2">
                              <button
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusChange(
                                    booking.id,
                                    "completed"
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                              >
                                <CheckCircle2 size={14} />
                                {isUpdating ? "กำลังบันทึก..." : "เสร็จสิ้น"}
                              </button>

                              <button
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusChange(
                                    booking.id,
                                    "cancelled"
                                  )
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                              >
                                <XCircle size={14} />
                                ยกเลิก
                              </button>
                            </div>
                          )}

                          {(booking.status === "completed" ||
                            booking.status === "cancelled") && (
                            <span className="text-xs text-slate-400">
                              ไม่มีการดำเนินการเพิ่มเติม
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
          <ShieldCheck size={20} className="mt-0.5 shrink-0" />
          <p>
            การเปลี่ยนสถานะจะตรวจสอบสิทธิ์ Admin ในฐานข้อมูล
            และอนุญาตเฉพาะลำดับสถานะที่กำหนดไว้
          </p>
        </div>
      </section>
    </main>
  );
}
