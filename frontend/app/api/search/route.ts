import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";

  const items = [
    {
      id: 1,
      title: "Lapangan Futsal Arena",
      location: "Surabaya",
      category: "Lapangan",
      price: "Rp150.000/jam",
    },
    {
      id: 2,
      title: "Lapangan Indoor Central",
      location: "Jakarta",
      category: "Lapangan",
      price: "Rp200.000/jam",
    },
    {
      id: 3,
      title: "Pelatih Pribadi Futsal",
      location: "Bandung",
      category: "Pelatih",
      price: "Rp100.000/jam",
    },
    {
      id: 4,
      title: "Turnamen Mingguan",
      location: "Yogyakarta",
      category: "Turnamen",
      price: "Varies",
    },
  ];

  const results = items.filter((item) => {
    const matchesQ = q
      ? (item.title + " " + item.location).toLowerCase().includes(q)
      : true;
    const matchesCategory =
      category && category !== "Semua Kategori"
        ? item.category === category
        : true;
    return matchesQ && matchesCategory;
  });

  return NextResponse.json({ results });
}
