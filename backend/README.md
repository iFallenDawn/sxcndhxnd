# sxcndhxnd Backend

## Prereqs
linux machine or wsl lmao

```bash
cd backend/
uv sync
source .venv/bin/activate
```
may need to change python interpreter in vscode to `.venv/bin/python3.13

create `.env` file in `backend/`
```

# User Info
_UID=1000
_ADJUSTED_UID=1000
USER=<USER HERE>

# Docker Info
COMPOSE_PROJECT_NAME=

# API Keys
SUPABASE_URL=<KEY HERE>
SUPABASE_KEY=<KEY HERE>
RESEND_API_KEY=<KEY HERE>

# SUPABASE DB PW
<DB PW HERE>

# Service Ports
FRONTEND_PORT=3000
BACKEND_PORT=8000

# Email
ADMIN_NOTIFICATION_EMAIL=<EMAIL HERE>

```

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