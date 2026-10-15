
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
  description: string | null;
  price: number;
  duration_minutes: number;
  is_active: boolean;
};

type Barber = {
  id: string;
  name: string;
  is_active: boolean;
};

type BookingResult = {
  booking_id: string;
  booking_status: string;
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
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [serviceResult, barberResult] = await Promise.all([
          supabase
            .from("services")
            .select(
              "id, name, description, price, duration_minutes, is_active"
            )
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
          setMessage("โหลดข้อมูลบริการไม่สำเร็จ กรุณารีเฟรชหน้าเว็บ");
        } else {
          const loadedServices = (serviceResult.data ?? []) as Service[];
          setServices(loadedServices);

          if (
            selectedServiceId &&
            loadedServices.some((service) => service.id === selectedServiceId)
          ) {
            setServiceId(selectedServiceId);
          } else if (!selectedServiceId && loadedServices.length > 0) {
            setServiceId(loadedServices[0].id);
          }
        }

        if (barberResult.error) {
          console.error("Failed to load barbers:", barberResult.error);
          setMessage("โหลดข้อมูลช่างไม่สำเร็จ กรุณารีเฟรชหน้าเว็บ");
        } else {
          setBarbers((barberResult.data ?? []) as Barber[]);
        }
      } catch (error) {
        console.error("Failed to load booking form:", error);
        setMessage("เกิดข้อผิดพลาดขณะโหลดข้อมูล กรุณารีเฟรชหน้าเว็บ");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedServiceId]);

  const selectedService = services.find(
    (service) => service.id === serviceId
  );
  const selectedBarber = barbers.find((barber) => barber.id === barberId);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) return;

    setMessage("");
    setBookingSuccess(false);

    if (!serviceId || !barberId || !date || !time) {
      setMessage("กรุณากรอกข้อมูลการจองให้ครบ");
      return;
    }

    const cleanName = customerName.trim();
    const cleanPhone = customerPhone.trim();

    if (cleanName.length < 2 || cleanName.length > 100) {
      setMessage("ชื่อผู้จองต้องมีความยาว 2–100 ตัวอักษร");
      return;
    }

    if (!/^[0-9+\-()\s]{9,20}$/.test(cleanPhone)) {
      setMessage("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
      return;
    }

    const startAt = new Date(`${date}T${time}:00`);

    if (
      Number.isNaN(startAt.getTime()) ||
      startAt <= new Date()
    ) {
      setMessage("กรุณาเลือกวันและเวลาในอนาคต");
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.rpc("create_booking", {
        p_customer_name: cleanName,
        p_customer_phone: cleanPhone,
        p_service_id: serviceId,
        p_barber_id: barberId,
        p_start_at: startAt.toISOString(),
      });

      if (error) {
        console.error("Booking failed:", error);

        if (
          error.message.includes("ช่วงเวลานี้มีผู้จองช่างแล้ว")
        ) {
          setMessage("ช่วงเวลานี้มีผู้จองแล้ว กรุณาเลือกเวลาอื่น");
        } else if (
          error.message.includes("กรุณาเลือกวันและเวลา")
        ) {
          setMessage(error.message);
        } else {
          setMessage(
            "จองคิวไม่สำเร็จ กรุณาตรวจสอบข้อมูลแล้วลองอีกครั้ง"
          );
        }

        return;
      }

      const result = Array.isArray(data)
        ? (data[0] as BookingResult | undefined)
        : undefined;

      if (!result?.booking_id) {
        setMessage(
          "ไม่พบรหัสยืนยันการจอง กรุณาตรวจสอบในระบบก่อนลองใหม่"
        );
        return;
      }

      setBookingSuccess(true);
      setMessage(
        `จองคิวสำเร็จ! รหัสการจอง: ${result.booking_id} สถานะ: ${result.booking_status}`
      );

      setCustomerName("");
      setCustomerPhone("");
      setDate("");
      setTime("");
    } catch (error) {
      console.error("Unexpected booking error:", error);
      setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

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
            เลือกบริการ ช่าง และเวลาที่คุณสะดวก
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
                <label
                  htmlFor="service"
                  className="mb-2 block text-sm font-semibold"
                >
                  เลือกบริการ
                </label>
                <select
                  id="service"
                  required
                  value={serviceId}
                  onChange={(event) => setServiceId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">กรุณาเลือกบริการ</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} — ฿
                      {Number(service.price).toLocaleString("th-TH")}
                    </option>
                  ))}
                </select>
                {services.length === 0 && (
                  <p className="mt-2 text-sm text-amber-700">
                    ไม่พบบริการที่เปิดใช้งาน กรุณาตรวจสอบ Supabase
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="barber"
                  className="mb-2 block text-sm font-semibold"
                >
                  เลือกช่าง
                </label>
                <select
                  id="barber"
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
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-semibold"
                >
                  ชื่อผู้จอง
                </label>
                <input
                  id="customerName"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="กรอกชื่อของคุณ"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="mb-2 block text-sm font-semibold"
                >
                  เบอร์โทรศัพท์
                </label>
                <input
                  id="customerPhone"
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
                  <label
                    htmlFor="date"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold"
                  >
                    <CalendarDays size={17} />
                    วันที่จอง
                  </label>
                  <input
                    id="date"
                    required
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold"
                  >
                    <Clock size={17} />
                    เวลาที่ต้องการ
                  </label>
                  <input
                    id="time"
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
                disabled={
                  submitting ||
                  services.length === 0 ||
                  barbers.length === 0
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={19} />
                {submitting ? "กำลังบันทึกการจอง..." : "ยืนยันการจอง"}
              </button>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`break-words rounded-xl p-4 text-sm leading-6 ${
                    bookingSuccess
                      ? "bg-green-50 text-green-800"
                      : "bg-amber-50 text-amber-800"
                  }`}
                >
                  {message}
                </p>
              )}

              <p className="text-xs leading-5 text-slate-500">
                การจองจะมีสถานะรอยืนยัน (pending) เมื่อบันทึกสำเร็จ
              </p>
            </form>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRound size={24} />
              </div>
              <h2 className="mt-4 text-lg font-bold">สรุปรายการจอง</h2>

              {selectedService ? (
                <>
                  <p className="mt-5 font-semibold">
                    {selectedService.name}
                  </p>
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

              {selectedBarber && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-sm text-slate-500">ช่างที่เลือก</p>
                  <p className="mt-1 font-semibold">{selectedBarber.name}</p>
                </div>
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
