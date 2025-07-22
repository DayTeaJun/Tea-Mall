export async function POST(req: Request) {
  const { orderId, paymentKey, amount } = await req.json();

  const secretKey = process.env.NEXT_PRIVATE_TOSS_SECRET_KEY!;
  const encoded = Buffer.from(`${secretKey}:`).toString("base64");

  const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      paymentKey,
      amount,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    return new Response(
      JSON.stringify({ message: "토스 결제 인증 실패", data: error }),
      { status: 400 },
    );
  }

  const result = await res.json();
  return new Response(JSON.stringify(result));
}
