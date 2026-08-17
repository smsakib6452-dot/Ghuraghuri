# Running Ghuraghuri with XAMPP

The frontend is static, but the travel-services pages (`hotels.html`, `restaurants.html`, `transport.html`, `travel.html` and the destination-page panels) call a PHP API under `api/`. This guide sets that up with XAMPP.

## 1. Install XAMPP

Download from https://www.apachefriends.org and install to `C:\xampp`. You need at least **PHP 8.1** (XAMPP ships 8.x by default).

Verify PHP:

```bat
C:\xampp\php\php.exe -v
```

## 2. Place the project under the web root

Copy the project folder (the one containing `index.html`) into the XAMPP web root:

```
C:\xampp\htdocs\ghuraghuri\
```

So that `index.html` is at `C:\xampp\htdocs\ghuraghuri\index.html`.

## 3. Configure the frontend

Open `config.js` in the project root and set the API base URL:

```js
API_BASE_URL: "http://localhost/ghuraghuri/api"
```

`config.js` is gitignored; `config.example.js` and `js/config-defaults.js` contain safe fallbacks (empty string = travel pages show a friendly "not configured" state).

## 4. Configure the backend

Copy the template:

```bat
copy api\.env.example api\.env
```

Edit `api\.env`:

- `APP_BASE_URL=http://localhost/ghuraghuri/`
- `DB_*` — MySQL credentials if you want persistence (see step 6). Optional.
- `ADMIN_API_TOKEN` — generate one: `C:\xampp\php\php.exe -r "echo bin2hex(random_bytes(16));"`
- Provider keys — see docs/PROVIDERS.md. All optional.

## 5. Start Apache (or use the PHP built-in server)

**Option A — Apache (XAMPP Control Panel):**

1. Open the XAMPP Control Panel.
2. Start **Apache**.
3. Open http://localhost/ghuraghuri/ and http://localhost/ghuraghuri/api/health — you should see a JSON `{"ok":true,...}`.

`api/.htaccess` is included so the API responds on Apache without URL rewriting issues.

**Option B — PHP built-in server (no Apache needed):**

```bat
C:\xampp\php\php.exe -S localhost:8000 -t C:\xampp\htdocs\ghuraghuri C:\xampp\htdocs\ghuraghuri\api\index.php
```

Then open http://localhost:8000/ (frontend) and http://localhost:8000/api/health (API).

## 6. Optional — MySQL database

The API works **without** MySQL (file cache + demo provider). To enable persistence for admin upserts and provider mappings:

1. Start **MySQL** in the XAMPP Control Panel.
2. Create the database and schema:

```bat
C:\xampp\mysql\bin\mysql.exe -u root < database\ghuraghuri.sql
```

3. Optionally seed sample hotels/restaurants:

```bat
C:\xampp\mysql\bin\mysql.exe -u root ghuraghuri < database\seed.sql
```

4. Make sure `api/.env` points at your DB (`DB_HOST`, `DB_USER`, `DB_PASSWORD`).

## 7. Verify

| Page | What it does |
| --- | --- |
| `/` | Home |
| `/api/health` | API alive |
| `/api/providers/status` | Which providers are configured |
| `/hotels.html` | Hotel search (demo data by default) |
| `/travel.html` | Unified search hub |

## Troubleshooting

- **404 on `/api/...`** — make sure the URL in `config.js` matches where the API is served.
- **`Could not reach the travel services API`** — the API isn't running or CORS blocks it (same-origin under `localhost/ghuraghuri` avoids CORS).
- **Admin API returns 503** — `ADMIN_API_TOKEN` is empty or still `change_me_to_a_long_random_string`.
- **Bangla text looks wrong in the console** — cosmetic only; the terminal can't render the encoding, the site itself is fine.