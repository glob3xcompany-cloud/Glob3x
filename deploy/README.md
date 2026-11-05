# Deploying glob3x.al to a VDS

This folder deploys the Next.js site to a plain Ubuntu server (Cherry Servers
VDS) behind nginx with a Let's Encrypt certificate. It touches **only** the web
stack — it never changes mail (MX), SPF, DKIM or DNS.

## One command on the server

As `root` on the VDS (Cherry Servers web console or SSH):

```bash
curl -fsSL https://raw.githubusercontent.com/<owner>/glob3x-group-web/main/deploy/bootstrap.sh \
  | bash -s -- https://github.com/<owner>/glob3x-group-web.git glob3x.al you@glob3x.al
```

(For a private repo, `git clone` the repo first, then run `bash deploy/bootstrap.sh <repo-url> glob3x.al you@glob3x.al`.)

The script: installs Node 22, nginx, certbot → clones the repo → builds →
runs it as the `glob3x` systemd service on `127.0.0.1:3001` → proxies it
through nginx → opens the firewall for HTTP/HTTPS (SSH stays open) → issues TLS
if DNS already points here.

## DNS at mysitearea.com (host.al panel)

Change **only** the website records; leave everything else frozen:

| Record | Change to |
| --- | --- |
| `A` `@` (glob3x.al) | `88.216.61.65` (remove the old Squarespace A records) |
| `A` `www` | `88.216.61.65` (or a CNAME to `glob3x.al`) |

**Do NOT touch:** `MX` (mailspamprotection.com), the SPF `TXT`, the
`default._domainkey` DKIM `TXT`, `NS`, or any mail record. `info@glob3x.al`
keeps working because mail is delivered by MX, not by the website A record.

After DNS propagates, if TLS was not issued during bootstrap:

```bash
certbot --nginx -d glob3x.al -d www.glob3x.al --redirect -m you@glob3x.al --agree-tos
```

## Updating later

```bash
bash /var/www/glob3x/app/deploy/update.sh
```

## Optional runtime keys

Edit `/var/www/glob3x/app/.env.production` (LEAD_WEBHOOK_URL, DEEPL_API_KEY,
HF_API_KEY/HF_API_SECRET) then `systemctl restart glob3x`.
