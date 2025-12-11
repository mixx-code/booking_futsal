import { NextResponse } from "next/server";
import { users } from "../usersStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan kata sandi diperlukan" },
        { status: 400 }
      );
    }

    if (users.has(email)) {
      return NextResponse.json(
        { message: "Pengguna sudah terdaftar" },
        { status: 409 }
      );
    }

    users.set(email, { name, email, password });

    return NextResponse.json({ message: "Terdaftar", email }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Permintaan tidak valid" },
      { status: 400 }
    );
  }
}
