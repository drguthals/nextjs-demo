import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export default async function handler(req: { method: string; body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: string; data?: any; error?: string; }): void; new(): any; }; }; }) {
  if (req.method === 'GET') {
    throw new Error("Sentry Example API Route Error");
    return NextResponse.json({ data: "Testing Sentry Error..." });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}