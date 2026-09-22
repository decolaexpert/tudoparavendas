export function NoAccess({ email }: { email: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-lg font-semibold text-zinc-900">Assinatura não encontrada</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Não encontramos uma assinatura ativa do Clube Tudo para Vendas para{" "}
        <strong>{email}</strong>. Se você acabou de comprar, aguarde alguns minutos — a
        liberação é automática após a confirmação do pagamento.
      </p>
    </div>
  );
}
