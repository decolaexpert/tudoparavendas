# -*- coding: utf-8 -*-
"""
Divide supabase/seed.sql em supabase/seed_parts/seed_part_NN.sql (chunks
pequenos) para contornar o bug de truncamento de colagem do SQL Editor do
Supabase (~100 linhas). Usado apenas para popular um banco novo do zero —
em um banco que já tem as 134 linhas, use scripts/gen_prompt_updates.py.

Uso (depois de rodar scripts/seed_from_xlsx.py):
    python3 scripts/gen_seed_parts.py
"""
import math

SEED_PATH = "supabase/seed.sql"
OUT_DIR = "supabase/seed_parts"
ROWS_PER_FILE = 8


def main():
    with open(SEED_PATH, encoding="utf-8") as f:
        lines = f.readlines()

    inserts = [ln for ln in lines if ln.startswith("insert into")]

    total_parts = math.ceil(len(inserts) / ROWS_PER_FILE)
    for part in range(total_parts):
        chunk = inserts[part * ROWS_PER_FILE : (part + 1) * ROWS_PER_FILE]
        header = [
            f"-- Parte {part + 1}/{total_parts} de {SEED_PATH}\n",
            "-- Cole este arquivo inteiro no SQL Editor e clique Run, "
            "depois passe pro próximo\n",
            "\n",
        ]
        out_path = f"{OUT_DIR}/seed_part_{part + 1:02d}.sql"
        with open(out_path, "w", encoding="utf-8") as f:
            f.writelines(header + chunk)

    print(f"OK: {len(inserts)} linhas em {total_parts} arquivos ({OUT_DIR}/seed_part_NN.sql)")


if __name__ == "__main__":
    main()
