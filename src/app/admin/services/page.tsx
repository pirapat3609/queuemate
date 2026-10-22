"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Pencil, Power, Scissors, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  is_active: boolean;
};

const emptyForm = {
  name: "",
  description: "",
  price: "150",
  duration_minutes: "30",
  is_active: true,
};

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      router.replace("/login");
      return;
    }
    const { data, error: queryError } = await supabase
      .from("services")
      .select("id, name, description, price, duration_minutes, is_active")
      .order("created_at", { ascending: true });
    if (queryError) {
      setError("โหลดบริการไม่สำเร็จ: " + queryError.message);
    } else {
      setServices((data ?? []) as Service[]);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadServices();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadServices]);

  function startEdit(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description ?? "",
      price: String(service.price),
      duration_minutes: String(service.duration_minutes),
      is_active: service.is_active,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const price = Number(form.price);
    const duration = Number(form.duration_minutes);
    if (!form.name.trim()) {
      setError("กรุณากรอกชื่อบริการ");
      setSaving(false);
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("ราคาต้องเป็นตัวเลขตั้งแต่ 0 บาทขึ้นไป");
      setSaving(false);
      return;
    }
    if (!Number.isInteger(duration) || duration < 5 || duration > 600) {
      setError("ระยะเวลาต้องเป็นจำนวนเต็มระหว่าง 5–600 นาที");
      setSaving(false);
      return;
    }

    const { data, error: rpcError } = await supabase.rpc("admin_save_service", {
      p_service_id: editingId,
      p_name: form.name.trim(),
      p_description: form.description.trim() || null,
      p_price: price,
      p_duration_minutes: duration,
      p_is_active: form.is_active,
    });

    if (rpcError || !data) {
      setError(rpcError?.message ?? "บันทึกบริการไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ Admin และ SQL");
    } else {
      setMessage(editingId ? "แก้ไขบริการเรียบร้อยแล้ว" : "เพิ่มบริการเรียบร้อยแล้ว");
      resetForm();
      await loadServices();
    }
    setSaving(false);
  }

  async function toggleService(service: Service) {
    const action = service.is_active ? "ปิด" : "เปิด";
    if (!window.confirm(`ต้องการ${action}บริการ "${service.name}" ใช่หรือไม่?`)) return;
    setError("");
    setMessage("");
    const { data, error: rpcError } = await supabase.rpc("admin_save_service", {
      p_service_id: service.id,
      p_name: service.name,
      p_description: service.description,
      p_price: Number(service.price),
      p_duration_minutes: service.duration_minutes,
      p_is_active: !service.is_active,
    });
    if (rpcError || !data) {
      setError(rpcError?.message ?? "เปลี่ยนสถานะบริการไม่สำเร็จ");
      return;
    }
    setMessage(`เปลี่ยนสถานะบริการ "${service.name}" แล้ว`);
    await loadServices();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white"><Scissors size={22} /></div>
            <div><h1 className="text-xl font-bold">QueueMate <span className="text-blue-600">Admin</span></h1><p className="text-xs text-slate-500">จัดการบริการ</p></div>
          </div>
          <button onClick={() => router.push("/admin")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"><ArrowLeft size={16} />กลับหน้า Dashboard</button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Service Management</p>
        <h2 className="mt-2 text-3xl font-bold">จัดการบริการ</h2>
        <p className="mt-2 text-sm text-slate-500">เพิ่มบริการ แก้ไขราคาและระยะเวลา หรือปิดบริการชั่วคราวได้</p>

        {message && <div role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div>}
        {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold">{editingId ? "แก้ไขบริการ" : "เพิ่มบริการใหม่"}</h3>
            {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm"><X size={15} />ยกเลิกแก้ไข</button>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">ชื่อบริการ *
              <input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500" placeholder="เช่น ตัดผมชาย" />
            </label>
            <label className="block text-sm font-medium">รายละเอียด
              <input maxLength={500} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500" placeholder="รายละเอียดบริการ" />
            </label>
            <label className="block text-sm font-medium">ราคา (บาท) *
              <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500" />
            </label>
            <label className="block text-sm font-medium">ระยะเวลา (นาที) *
              <input required type="number" min="5" max="600" step="1" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500" />
            </label>
          </div>
          <label className="mt-4 flex items-center gap-3 text-sm font-medium">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 accent-blue-600" />
            เปิดให้ลูกค้าจองบริการนี้
          </label>
          <button disabled={saving} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"><Save size={17} />{saving ? "กำลังบันทึก..." : editingId ? "บันทึกการแก้ไข" : <><Plus size={17} />เพิ่มบริการ</>}</button>
        </form>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4"><h3 className="font-bold">บริการทั้งหมด</h3><p className="mt-1 text-sm text-slate-500">มี {services.length} บริการ</p></div>
          {loading ? <p className="p-10 text-center text-slate-500">กำลังโหลดบริการ...</p> : services.length === 0 ? <p className="p-10 text-center text-slate-500">ยังไม่มีบริการ</p> : (
            <div className="divide-y divide-slate-100">
              {services.map((service) => (
                <article key={service.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><h4 className="font-bold">{service.name}</h4><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${service.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{service.is_active ? "เปิดให้จอง" : "ปิดบริการ"}</span></div>
                    <p className="mt-1 text-sm text-slate-500">{service.description || "ไม่มีรายละเอียด"}</p>
                    <p className="mt-2 text-sm font-semibold text-blue-700">{Number(service.price).toLocaleString("th-TH")} บาท <span className="font-normal text-slate-500">· {service.duration_minutes} นาที</span></p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => startEdit(service)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"><Pencil size={15} />แก้ไข</button>
                    <button onClick={() => toggleService(service)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${service.is_active ? "border-amber-200 text-amber-800 hover:bg-amber-50" : "border-emerald-200 text-emerald-800 hover:bg-emerald-50"}`}><Power size={15} />{service.is_active ? "ปิดบริการ" : "เปิดบริการ"}</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <p className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">การเพิ่มและแก้ไขบริการจะผ่านฟังก์ชันในฐานข้อมูลที่ตรวจสอบสิทธิ์ Admin ก่อนบันทึก</p>
      </section>
    </main>
  );
}
