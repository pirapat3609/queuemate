
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Scissors,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "จองคิวออนไลน์",
    description:
      "ให้ลูกค้าเลือกบริการ วันที่ และเวลาที่สะดวกได้ง่าย ๆ",
  },
  {
    icon: Clock3,
    title: "จัดการเวลาอย่างเป็นระบบ",
    description:
      "ดูรายการจองและสถานะคิวทั้งหมดได้จากที่เดียว",
  },
  {
    icon: ShieldCheck,
    title: "ข้อมูลเป็นระเบียบ",
    description:
      "เตรียมระบบจัดการข้อมูลและสิทธิ์ผู้ใช้ให้เหมาะสม",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Queue<span className="text-blue-600">Mate</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-blue-600">
              ฟีเจอร์
            </a>
            <a href="#how-it-works" className="transition hover:text-blue-600">
              วิธีใช้งาน
            </a>
          </div>

          <Link
            href="/services"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            จองคิวเลย
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Sparkles size={16} />
            Your smarter booking experience
          </div>

          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            จองคิวง่ายขึ้น
            <br />
            <span className="text-blue-600">จัดการร้านดีขึ้น</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            ระบบจองคิวออนไลน์สำหรับร้านบริการ
            ช่วยให้ลูกค้าจองสะดวก และเจ้าของร้านจัดการตารางงานได้ในที่เดียว
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              เริ่มจองคิว
              <ArrowRight size={18} />
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-slate-200 bg-white px-6 py-4 font-semibold transition hover:bg-slate-100"
            >
              ดูฟีเจอร์
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              ใช้งานง่าย
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              รองรับมือถือ
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-blue-100/60 blur-2xl" />

          <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Dashboard Preview</p>
                <h2 className="mt-1 text-xl font-bold">
                  ภาพรวมการจอง
                </h2>
              </div>

              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <CalendarCheck size={26} />
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">คิววันนี้</p>
                <p className="mt-2 text-3xl font-bold">12</p>
                <p className="mt-1 text-xs text-slate-400">
                  ข้อมูลตัวอย่าง
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-5">
                <p className="text-sm text-blue-700">ยืนยันแล้ว</p>
                <p className="mt-2 text-3xl font-bold text-blue-700">
                  8
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  ข้อมูลตัวอย่าง
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between">
              <h3 className="font-bold">รายการคิว</h3>
              <span className="text-xs text-slate-400">
                TODAY
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                {
                  time: "10:00",
                  name: "ตัดผมชาย",
                  status: "ยืนยันแล้ว",
                },
                {
                  time: "11:30",
                  name: "ตัดผม + สระ",
                  status: "รอยืนยัน",
                },
                {
                  time: "13:00",
                  name: "จัดแต่งทรงผม",
                  status: "ยืนยันแล้ว",
                },
              ].map((booking) => (
                <div
                  key={booking.time}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold">
                      {booking.time}
                    </div>
                    <span className="text-sm font-medium">
                      {booking.name}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      booking.status === "ยืนยันแล้ว"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              <Scissors size={16} />
              ตัวอย่างระบบจัดการคิวร้านบริการ
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-slate-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold tracking-widest text-blue-600">
              FEATURES
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              ทุกคิวจัดการได้ง่ายในที่เดียว
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              เครื่องมือสำหรับช่วยให้การจองคิวและจัดการร้านสะดวกยิ่งขึ้น
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="inline-flex rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Icon size={25} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-blue-600 px-8 py-14 text-center text-white md:px-16">
          <h2 className="text-3xl font-bold md:text-4xl">
            ให้ทุกการจองเป็นเรื่องง่าย
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
            เริ่มต้นประสบการณ์การจองคิวที่สะดวกสำหรับลูกค้า
            และเป็นระบบสำหรับเจ้าของร้าน
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            สำรวจบริการ
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>
            <span className="font-bold text-slate-900">QueueMate</span>
            {" "}— Book smarter. Serve better.
          </p>
          <p>© 2026 QueueMate · Portfolio Project</p>
        </div>
      </footer>
    </main>
  );
}
