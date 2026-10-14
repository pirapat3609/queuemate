"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  Scissors,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "จองคิวง่ายในไม่กี่ขั้นตอน",
    description: "เลือกบริการและเวลาที่สะดวกได้จากทุกที่",
  },
  {
    icon: Clock,
    title: "รู้เวลานัดหมายชัดเจน",
    description: "วางแผนเวลาได้ง่าย ไม่ต้องรอหน้าร้านนาน",
  },
  {
    icon: ShieldCheck,
    title: "จัดการคิวอย่างเป็นระบบ",
    description: "ข้อมูลการจองถูกรวบรวมไว้ในที่เดียว",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Scissors size={21} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Queue<span className="text-blue-600">Mate</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">
              หน้าแรก
            </Link>
            <Link href="/services" className="text-sm font-medium text-slate-600 hover:text-blue-600">
              บริการ
            </Link>
          </nav>

          <Link
            href="/services"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            จองคิวเลย
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <Sparkles size={16} />
              ระบบจองคิวที่ใช้งานง่าย
            </div>

            <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              จองคิวง่ายขึ้น
              <br />
              <span className="text-blue-600">ใช้เวลาได้คุ้มค่า</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
              QueueMate ช่วยให้คุณเลือกบริการและวางแผนเวลานัดหมายได้สะดวก
              ไม่ต้องเสียเวลารอคิวโดยไม่จำเป็น
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                จองคิวเลย
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                ดูบริการทั้งหมด
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-blue-600" />
                ใช้งานง่าย
              </span>
              <span className="flex items-center gap-2">
                <Clock size={17} className="text-blue-600" />
                ประหยัดเวลา
              </span>
            </div>
          </div>

          {/* Booking Preview */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-100 to-indigo-100 blur-xl" />

            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">ตัวอย่างหน้าจอ</p>
                  <h2 className="mt-1 text-xl font-bold">จองบริการ</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <CalendarCheck size={25} />
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Scissors size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">ตัดผมชาย</p>
                    <p className="mt-1 text-sm text-slate-500">ประมาณ 30 นาที</p>
                  </div>
                  <p className="font-bold text-blue-600">฿150</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">วันที่</p>
                  <p className="mt-2 font-semibold">เลือกวันนัดหมาย</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">เวลา</p>
                  <p className="mt-2 font-semibold">เลือกเวลาที่สะดวก</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                <Smartphone size={20} />
                จองคิวได้สะดวกผ่านเว็บไซต์
              </div>

              <Link
                href="/services"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                ดูบริการทั้งหมด
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Why QueueMate
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              จองคิวให้ง่ายกว่าเดิม
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              ออกแบบมาเพื่อให้ลูกค้าและร้านค้าจัดการเวลานัดหมายได้สะดวกยิ่งขึ้น
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-blue-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            พร้อมจองคิวครั้งต่อไปหรือยัง?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
            เลือกบริการที่ต้องการ แล้วเริ่มวางแผนเวลาของคุณได้เลย
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            เลือกบริการ
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold">
            Queue<span className="text-blue-600">Mate</span>
          </p>
          <p className="text-sm text-slate-500">
            ระบบจองคิวที่ช่วยให้การนัดหมายง่ายขึ้น
          </p>
        </div>
      </footer>
    </main>
  );
}