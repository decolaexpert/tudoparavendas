import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MemberStatus } from "@/lib/types";

/**
 * Webhook do Hotmart (Postback).
 *
 * Configuração na Hotmart: Ferramentas > Webhook > cadastrar
 *   URL: https://studio.tudoparavendas.com.br/api/webhooks/hotmart
 *   Eventos: PURCHASE_APPROVED, PURCHASE_COMPLETE, PURCHASE_REFUNDED,
 *            PURCHASE_CHARGEBACK, PURCHASE_CANCELED, SUBSCRIPTION_CANCELLATION
 *
 * A Hotmart permite configurar um "Hottok" (token) que é enviado no corpo
 * do payload (campo `hottok`). Validamos esse valor contra
 * HOTMART_WEBHOOK_TOKEN antes de processar qualquer coisa.
 *
 * Referência oficial: https://developers.hotmart.com/docs/pt-BR/webhooks/
 */

const ACTIVE_EVENTS = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
const REVOKE_EVENTS = new Set([
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "PURCHASE_PROTEST",
  "SUBSCRIPTION_CANCELLATION",
]);

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const expectedToken = process.env.HOTMART_WEBHOOK_TOKEN;
  const receivedToken = payload.hottok ?? request.headers.get("x-hotmart-hottok");

  if (!expectedToken || receivedToken !== expectedToken) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  const event: string | undefined = payload.event;
  const email: string | undefined = payload.data?.buyer?.email;
  const transactionId: string | undefined = payload.data?.purchase?.transaction;
  const subscriberCode: string | undefined = payload.data?.subscription?.subscriber?.code;

  if (!event || !email) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  let status: MemberStatus | null = null;
  if (ACTIVE_EVENTS.has(event)) status = "active";
  else if (REVOKE_EVENTS.has(event)) status = "refunded";

  if (!status) {
    // Evento que não precisamos tratar (ex: PIX gerado mas não pago ainda).
    return NextResponse.json({ received: true, ignored: event });
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from("members").upsert(
    {
      email: email.toLowerCase().trim(),
      status,
      hotmart_transaction_id: transactionId ?? null,
      hotmart_subscriber_code: subscriberCode ?? null,
      purchased_at: status === "active" ? new Date().toISOString() : undefined,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" },
  );

  if (error) {
    console.error("[hotmart-webhook] falha ao gravar member", error);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  return NextResponse.json({ received: true, email, status });
}
