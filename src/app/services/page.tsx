
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Scissors,
  Sparkles,
  Stethoscope,
} from "lucide-react";

const services = [
  {
    id: "barber",
    name: "ตัดผมชาย",
    category: "BARBER",
    description: "บริการตัดผมและออกแบบทรงผมให้เหมาะกับคุณ",
    price: 150,
    duration: 30,
    icon: Scissors,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "nails",
    name: "ทำเล็บ",
    category: "NAIL SALON",
    description: "ดูแลเล็บและเพิ่มสีสันให้สไตล์ของคุณ",
    price: 250,
    duration: 45,
    icon: Sparkles,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: "consultation",
    name: "ปรึกษาเบื้องต้น",
    category: "CONSULTATION",
    description: "เลือกเวลานัดหมายเพื่อพูดคุยกับผู้ให้บริการ",
    price: 0,
    duration: 30,
    icon: Stethoscope,
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Queue<span className="text-blue-600">Mate</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            กลับหน้าหลัก
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <p className="text-sm font-semibold tracking-widest text-blue-600">
          OUR SERVICES
        </p>

        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              เลือกบริการที่คุณต้องการ
            </h1>
            <p className="mt-4 text-slate-600">
              เลือกบริการเพื่อเริ่มต้นขั้นตอนการจองคิว
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {services.length} บริการตัวอย่าง
          </span>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-2xl p-4 ${service.color}`}>
                    <Icon size={28} />
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    {service.category}
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-bold">
                  {service.name}
                </h2>

                <p className="mt-3 min-h-14 leading-7 text-slate-600">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-xs text-slate-500">ราคาเริ่มต้น</p>
                    <p className="mt-1 text-2xl font-bold">
                      {service.price === 0
                        ? "ฟรี"
                        : `฿${service.price}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Clock3 size={16} />
                    {service.duration} นาที
                  </div>
                </div>

                <Link
                  href={`/booking?service=${service.id}`}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                >
                  เลือกบริการนี้
                  <ArrowRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          ข้อมูลบริการและราคาเป็นตัวอย่างสำหรับพัฒนา Portfolio
        </p>
      </section>
    </main>
  );
}
