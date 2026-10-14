"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Scissors,
  UserRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
};

type Barber = {
  id: string;
  name: string;
  is_active: boolean;
};

export default function BookingPage() {
  const searchParams = useSearchParams();
  const selectedServiceId = searchParams.get("service");

  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [serviceId, setServiceId] = useState(selectedServiceId ?? "");
  const [barberId, setBarberId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [serviceResult, barberResult] = await Promise.all([
        supabase
          .from("services")
          .select("id, name, price, duration_minutes, is_active")
          .eq("is_active", true)
          .order("price", { ascending: true }),
        supabase
          .from("barbers")
          .select("id, name, is_active")
          .eq("is_active", true)
          .order("name", { ascending: true }),
      ]);

      if (serviceResult.error) {
        console.error("Failed to load services:", serviceResult.error);
      } else {
        setServices((serviceResult.data ?? []) as Service[]);
      }

      if (barberResult.error) {
        console.error("Failed to load barbers:", barberResult.error);
      } else {
        setBarbers((barberResult.data ?? []) as Barber[]);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const selectedService = services.find((service) => service.id === serviceId);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    alert(
      "แบบฟอร์มพร้อมแล้ว แต่ยังไม่ได้บันทึกการจองจริง\n" +
        `บริการ: ${selectedService?.name ?? "-"}\n` +
        `ชื่อ: ${customerName}\n` +
        `เบอร์โทร: ${customerPhone}\n` +
        `วันที่: ${date}\n` +
        `เวลา: ${time}`
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Scissors size={21} />
            </div>
            <span className="text-xl font-bold">
              Queue<span className="text-blue-600">Mate</span>
            </span>
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            กลับไปหน้าบริการ
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <div className="mb-8">
          <p className="text-sm font-bold tracking-widest text-blue-600">
            BOOK AN APPOINTMENT
          </p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            จองคิวของคุณ
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            กรอกข้อมูลและเลือกเวลาที่คุณสะดวก
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            กำลังโหลดข้อมูลบริการและรายชื่อช่าง...
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  เลือกบริการ
                </label>
                <select
                  required
                  value={serviceId}
                  onChange={(event) => setServiceId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">กรุณาเลือกบริการ</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} — ฿{service.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  เลือกช่าง
                </label>
                <select
                  required
                  value={barberId}
                  onChange={(event) => setBarberId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">กรุณาเลือกช่าง</option>
                  {barbers.map((barber) => (
                    <option key={barber.id} value={barber.id}>
                      {barber.name}
                    </option>
                  ))}
                </select>
                {barbers.length === 0 && (
                  <p className="mt-2 text-sm text-amber-700">
                    ไม่พบรายชื่อช่าง กรุณาตรวจสอบข้อมูลใน Supabase
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  ชื่อผู้จอง
                </label>
                <input
                  required
                  maxLength={100}
                  autoComplete="name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="กรอกชื่อของคุณ"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  เบอร์โทรศัพท์
                </label>
                <input
                  required
                  type="tel"
                  maxLength={20}
                  autoComplete="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="เช่น 0812345678"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <CalendarDays size={17} />
                    วันที่จอง
                  </label>
                  <input
                    required
                    type="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Clock size={17} />
                    เวลาที่ต้องการ
                  </label>
                  <input
                    required
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                <CheckCircle2 size={19} />
                ตรวจสอบข้อมูลการจอง
              </button>

              <p className="text-xs leading-5 text-slate-500">
                ขณะนี้เป็นแบบฟอร์มทดสอบ ข้อมูลยังไม่ถูกบันทึกเป็นการจองจริง
              </p>
            </form>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRound size={24} />
              </div>
              <h2 className="mt-4 text-lg font-bold">สรุปรายการจอง</h2>

              {selectedService ? (
                <>
                  <p className="mt-5 font-semibold">{selectedService.name}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    ใช้เวลาประมาณ {selectedService.duration_minutes} นาที
                  </p>
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <p className="text-sm text-slate-500">ราคารวม</p>
                    <p className="mt-1 text-3xl font-extrabold text-blue-600">
                      ฿{Number(selectedService.price).toLocaleString("th-TH")}
                    </p>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  เลือกบริการเพื่อดูราคาและระยะเวลา
                </p>
              )}

              {date && time && (
                <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                  วันนัดหมาย: {date}
                  <br />
                  เวลา: {time}
                </div>
              )}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}