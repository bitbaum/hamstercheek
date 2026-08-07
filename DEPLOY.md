# Deploying HamsterCheek to your own server (Hetzner)

This spins up the whole thing — Postgres **and** the app — with one command.
Migrations run automatically on the first boot, so the database is created and
schema-ready without a separate step.

## What you need on the server

- A Hetzner Cloud VM (a CX22 / 2 vCPU, 4 GB is plenty) running Ubuntu 24.04.
- Docker with the Compose plugin:
  ```bash
  curl -fsSL https://get.docker.com | sh
  ```
- Ports: SSH (22) and 443 open in the Hetzner firewall. You do **not** need to
  expose 3000 publicly — put a reverse proxy in front (below).

## First deploy

```bash
git clone https://github.com/maonakamoto/hamstercheek.git
cd hamstercheek

cp .env.docker.example .env
# edit .env and set a long, random POSTGRES_PASSWORD
nano .env

docker compose up -d --build
```

That's it. Check it came up:

```bash
docker compose ps
docker compose logs -f app        # watch "applying database migrations" -> "starting HamsterCheek"
curl -I http://localhost:3000     # expect HTTP 200
```

Your stashes now live in the `db-data` Docker volume and uploaded photos in the
`uploads` volume — both survive `docker compose down` and rebuilds. They are
deleted only if you explicitly remove the volumes (`docker compose down -v`).

## Put it behind HTTPS

The app listens on `127.0.0.1:3000`. Terminate TLS with a reverse proxy so it's
reachable at your domain. Caddy is the least fuss — one file, automatic certs:

`/etc/caddy/Caddyfile`
```
hamstercheek.example.com {
    reverse_proxy 127.0.0.1:3000
}
```
```bash
docker run -d --name caddy --network host \
  -v /etc/caddy/Caddyfile:/etc/caddy/Caddyfile \
  -v caddy_data:/data caddy:2
```
Point an A record at the server's IP first; Caddy fetches the certificate on the
first request.

## Updating to a new version

```bash
cd hamstercheek
git pull
docker compose up -d --build
```

New migrations (if any) apply automatically on restart.

## Backups (do this)

The database is the thing you can't recreate. A daily dump:

```bash
docker compose exec -T db pg_dump -U hamster hamstercheek > backup-$(date +%F).sql
```

Restore into a fresh stack:

```bash
docker compose exec -T db psql -U hamster hamstercheek < backup-YYYY-MM-DD.sql
```

## Notes

- `next build` needs `DATABASE_URL` to be *set* but never connects at build time
  (all routes are dynamic), which is why the image builds with a throwaway URL
  and only uses the real one at runtime.
- The app image ships its full dependency tree on purpose: migrations run at
  startup via `tsx`, which is a dev dependency.
- Photo uploads are written to local disk (the `uploads` volume). That's fine
  for this single-server setup; move to object storage before scaling out.
