import { redirect } from "next/navigation";

/** Detail PO pindah ke Finance · link lama dialihkan ke halaman detail baru */
export default async function OpsPoDetailRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/finance/pembelian/po/${id}`);
}
