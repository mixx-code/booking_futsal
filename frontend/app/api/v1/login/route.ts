import { NextResponse } from "next/server";
import { users } from "../usersStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan kata sandi diperlukan" },
        { status: 400 }
      );
    }

    const user = users.get(email);
    if (!user) {
      return NextResponse.json(
        { message: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { message: "Email atau kata sandi salah" },
        { status: 401 }
      );
    }

    // For demo purposes return a fake token
    const token = "demo-token-" + Math.random().toString(36).slice(2, 10);

    return NextResponse.json(
      { message: "Berhasil masuk", token, email },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Permintaan tidak valid" },
      { status: 400 }
    );
  }
}
