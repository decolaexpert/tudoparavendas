export type MemberStatus = "active" | "inactive" | "refunded";

export type Member = {
  id: string;
  email: string;
  hotmart_transaction_id: string | null;
  hotmart_subscriber_code: string | null;
  status: MemberStatus;
  purchased_at: string | null;
  updated_at: string;
};

export type ReferenceCategoria = "evergreen" | "data_comemorativa";
export type ReferenceStatus = "a_gerar" | "gerado" | "aprovado" | "inativo";

export type ReferencePhoto = {
  id: string;
  categoria: ReferenceCategoria;
  tipo_peca: string;
  pose: string;
  data_comemorativa: string | null;
  nome_referencia: string;
  prompt_mestre: string;
  perfis_sugeridos: string | null;
  aspecto: string | null;
  thumbnail_url: string | null;
  status: ReferenceStatus;
  ordem: number;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      members: {
        Row: Member;
        Insert: Partial<Member> & { email: string };
        Update: Partial<Member>;
        Relationships: [];
      };
      reference_photos: {
        Row: ReferencePhoto;
        Insert: Partial<ReferencePhoto> & {
          categoria: ReferenceCategoria;
          tipo_peca: string;
          pose: string;
          nome_referencia: string;
          prompt_mestre: string;
        };
        Update: Partial<ReferencePhoto>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
