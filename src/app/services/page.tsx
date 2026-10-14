"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Scissors,
  Sparkles,
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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("services")
        .select(
          "id, name, description, price, duration_minutes, is_active"
        )
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) {
        console.error("Failed to fetch services:", error);
        setError("ไม่สามารถโหลดรายการบริการได้ กรุณาลองใหม่อีกครั้ง");
      } else {
        setServices((data ?? []) as Service[]);
      }

      setLoading(false);
    }

    fetchServices();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Scissors size={21} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Queue<span className="text-blue-600">Mate</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            กลับหน้าหลัก
          </Link>
        </div>
      </header>

      {/* Page heading */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Sparkles size={16} />
            เลือกบริการที่เหมาะกับคุณ
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            บริการของเรา
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            เลือกบริการที่ต้องการ ดูราคาและระยะเวลาให้ชัดเจน
            แล้วเริ่มต้นจองคิวของคุณได้ง่าย ๆ ผ่าน QueueMate
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={18} className="text-blue-600" />
              เลือกบริการได้ตามต้องการ
            </span>
            <span className="flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              แสดงระยะเวลาแต่ละบริการ
            </span>
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              OUR SERVICES
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              เลือกบริการของคุณ
            </h2>
          </div>

          {!loading && !error && (
            <p className="text-sm text-slate-500">
              {services.length} บริการ
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                <div className="mt-6 h-5 w-2/3 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-8 h-12 rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              โหลดหน้าใหม่
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <Scissors className="mx-auto text-slate-400" size={36} />
            <h3 className="mt-4 text-lg font-bold">
              ยังไม่มีบริการในขณะนี้
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              กรุณากลับมาตรวจสอบอีกครั้งภายหลัง
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    {index === 0 ? (
                      <Scissors size={26} />
                    ) : (
                      <Sparkles size={26} />
                    )}
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {service.duration_minutes} นาที
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {service.name}
                </h3>

                <p className="mt-3 min-h-12 leading-7 text-slate-500">
                  {service.description || "บริการดูแลทรงผมตามความต้องการของคุณ"}
                </p>

                <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-sm text-slate-500">ราคาเริ่มต้น</p>
                    <p className="mt-1 text-3xl font-extrabold text-blue-600">
                      ฿{Number(service.price).toLocaleString("th-TH")}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/booking?service=${encodeURIComponent(service.id)}`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700"
                >
                  เลือกบริการนี้
                  <ArrowRight size={18} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-bold">
            Queue<span className="text-blue-600">Mate</span>
          </Link>
          <p className="text-sm text-slate-500">
            ระบบจองคิวที่ช่วยให้การนัดหมายง่ายขึ้น
          </p>
        </div>
      </footer>
    </main>
  );
}