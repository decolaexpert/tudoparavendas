import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MemberStatus } from "@/lib/types";

/**
 * Webhook do Hotmart (Postback).
 *
 * Configuração na Hotmart: Ferramentas > Webhook > cadastrar
 *   URL: https://studio.tudoparavendas.com.br/api/webhooks/hotmart
 *   Eventos: PURCHASE_APPROVED, PURCHASE_COMPLETE, PURCHASE_REFUNDED,
 *            PURCHASE_CHARGEBACK, PURCHASE_CANCELED, PURCHASE_PROTEST,
 *            PURCHASE_EXPIRED, SUBSCRIPTION_CANCELLATION
 *
 * A Hotmart permite configurar um "Hottok" (token) que é enviado no corpo
 * do payload (campo `hottok`) e também no header `X-HOTMART-HOTTOK`.
 * Validamos esse valor contra HOTMART_WEBHOOK_TOKEN antes de processar
 * qualquer coisa.
 *
 * Produto é uma ASSINATURA RECORRENTE ANUAL: o Hotmart já controla a
 * renovação e a expiração — nós só seguimos o status que ele manda, sem
 * calcular data de expiração aqui. Ao cancelar a renovação, a assinante
 * continua com acesso normalmente até o fim do ciclo já pago; o corte real
 * só acontece quando chega PURCHASE_EXPIRED (fim do ciclo) ou um evento de
 * reembolso/chargeback/contestação (corte imediato).
 * SUBSCRIPTION_CANCELLATION é só um aviso de que não vai renovar — não
 * revoga acesso por si só.
 *
 * Se HOTMART_PRODUCT_ID estiver configurado, eventos de qualquer outro
 * produto da mesma conta Hotmart são ignorados (não tocam em `members`) —
 * importante se a conta vender mais de um produto.
 *
 * Referência oficial: https://developers.hotmart.com/docs/pt-BR/webhooks/
 */

const ACTIVE_EVENTS = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
// Dinheiro devolvido ou contestado — corte imediato, fica marcado como "refunded".
const REFUND_EVENTS = new Set(["PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK", "PURCHASE_PROTEST"]);
// Fim natural do ciclo pago (não renovou) — fica marcado como "inactive".
const EXPIRE_EVENTS = new Set(["PURCHASE_EXPIRED", "PURCHASE_CANCELED"]);

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
  // O ID do produto vem em campos diferentes dependendo do evento: compras
  // e renovações trazem `data.product.id`; o evento de cancelamento traz
  // `data.subscription.product.id`.
  const productId: string | number | undefined =
    payload.data?.product?.id ?? payload.data?.subscription?.product?.id;

  if (!event || !email) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const expectedProductId = process.env.HOTMART_PRODUCT_ID;
  if (expectedProductId && String(productId) !== expectedProductId) {
    // Compra de outro produto da mesma conta Hotmart — não é deste sistema.
    return NextResponse.json({ received: true, ignored_product: productId });
  }

  if (event === "SUBSCRIPTION_CANCELLATION") {
    // Só avisa que não vai renovar; a assinante mantém acesso até o fim do
    // ciclo já pago (o corte real chega depois via PURCHASE_EXPIRED).
    return NextResponse.json({ received: true, acknowledged: event });
  }

  let status: MemberStatus | null = null;
  if (ACTIVE_EVENTS.has(event)) status = "active";
  else if (REFUND_EVENTS.has(event)) status = "refunded";
  else if (EXPIRE_EVENTS.has(event)) status = "inactive";

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
