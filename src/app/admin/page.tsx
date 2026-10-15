
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
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_id: string;
  barber_id: string;
  start_at: string;
  end_at: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
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

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (!active) return;

      if (authError || !authData.user) {
        router.replace("/login");
        return;
      }

      setEmail(authData.user.email ?? "");

      const [
        { data: bookingData, error: bookingError },
        { data: serviceData },
        { data: barberData },
      ] = await Promise.all([
        supabase
          .from("bookings")
          .select(
            "id, customer_name, customer_phone, service_id, barber_id, start_at, end_at, status"
          )
          .order("start_at", { ascending: true }),
        supabase.from("services").select("id, name, price"),
        supabase.from("barbers").select("id, name"),
      ]);

      if (!active) return;

      if (bookingError) {
        setError(
          "ยังไม่สามารถอ่านรายการจองได้ กรุณาตรวจสอบสิทธิ์ RLS ของตาราง bookings ใน Supabase"
        );
      } else {
        setBookings((bookingData ?? []) as Booking[]);
      }

      setServices((serviceData ?? []) as Service[]);
      setBarbers((barberData ?? []) as Barber[]);
      setLoading(false);
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  function getServiceName(id: string) {
    return services.find((item) => item.id === id)?.name ?? "ไม่พบข้อมูลบริการ";
  }

  function getBarberName(id: string) {
    return barbers.find((item) => item.id === id)?.name ?? "ไม่พบข้อมูลช่าง";
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

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const statusLabels: Record<Booking["status"], string> = {
    pending: "รอยืนยัน",
    confirmed: "ยืนยันแล้ว",
    completed: "เสร็จสิ้น",
    cancelled: "ยกเลิก",
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
                QueueMate <span className="text-blue-600">Admin</span>
              </h1>
              <p className="text-xs text-slate-500">
                ระบบจัดการคิวร้านบริการ
              </p>
            </div>
          </div>

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
          <h2 className="mt-2 text-3xl font-bold">จัดการรายการจอง</h2>
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
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className={`mt-3 text-3xl font-bold ${item.color}`}>
                {loading ? "—" : item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="font-bold">รายการจองทั้งหมด</h3>
              <p className="mt-1 text-sm text-slate-500">
                ตรวจสอบวัน เวลา และข้อมูลการจอง
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              รีเฟรช
            </button>
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
              <p className="font-medium">ยังไม่มีรายการจองให้แสดง</p>
              <p className="mt-2 text-sm text-slate-500">
                หากมีข้อมูลจองอยู่แล้ว อาจต้องตั้งค่าสิทธิ์การอ่านข้อมูลก่อน
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">ลูกค้า</th>
                    <th className="px-5 py-4 font-medium">บริการ</th>
                    <th className="px-5 py-4 font-medium">ช่าง</th>
                    <th className="px-5 py-4 font-medium">วันที่</th>
                    <th className="px-5 py-4 font-medium">เวลา</th>
                    <th className="px-5 py-4 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {booking.customer_name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {booking.customer_phone}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {getServiceName(booking.service_id)}
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
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                          {statusLabels[booking.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
          <ShieldCheck size={20} className="mt-0.5 shrink-0" />
          <p>
            หน้านี้ตรวจสอบว่ามีผู้ใช้ล็อกอินแล้วเท่านั้น
            แต่การจำกัดสิทธิ์อ่านข้อมูลในฐานข้อมูลต้องตั้งค่า RLS
            ให้เจ้าของร้านที่ได้รับอนุญาตด้วย
          </p>
        </div>
      </section>
    </main>
  );
}
