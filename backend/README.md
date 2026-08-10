# sxcndhxnd Backend

## Prereqs
linux machine or wsl lmao

```bash
cd backend/
uv sync
source .venv/bin/activate
```
may need to change python interpreter in vscode to `.venv/bin/python3.13

## how to migrate pyproject.toml to requirements.txt
```bash
uv pip compile pyproject.toml -o requirements.txt
```

## how to auto generate pydantic models
note, need to go in and manually change all the email types to `email: EmailStr` instead of `email: str`


```
sb-pydantic gen --type pydantic --framework fastapi --db-url postgresql://postgres.wvsqcuiqbxaftjlrseyx:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres
```

## how to dump

```
pg_dump "postgresql://postgres.wvsqcuiqbxaftjlrseyx:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres" \
  -t users_roles \
  --schema-only \
  --no-owner \
  --no-privileges \
  -f users_roles.sql
```