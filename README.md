# terminal-x

Terminal-X is a modular Discord bot platform built as a monorepo. It provides a fully-featured Discord bot, a REST API service, a shared module for type definitions and utilities, and a modern web admin panel for managing your guild's configuration.

## Packages

- **@terminal-x/bot** – the Discord bot runtime powered by [discord.js](https://discord.js.org). Registers slash commands, listens for events, enforces permissions and rate limits, and communicates with the API.
- **@terminal-x/api** – a NestJS based REST API that exposes configuration endpoints, handles moderation and automation logic, and persists data via Prisma/PostgreSQL. It also implements Discord OAuth2 and issues JWTs for the web panel.
- **@terminal-x/shared** – shared TypeScript types, Zod schemas, enums and constants used by the bot, API and web packages.
- **@terminal-x/web** – a Next.js 14 admin panel with Tailwind styling. Allows guild owners and moderators to log in via Discord, view statistics, and configure every feature of the bot in real time.

## Getting started

1. **Clone the repository** and install dependencies with `npm install` at the root. We use npm workspaces so the packages are bootstrapped together.
2. **Set up your environment** by copying `.env.example` to `.env` and filling out the values. You will need a Discord bot token, client ID and secret from the Discord Developer Portal, and connection strings for Postgres and Redis.
3. **Run the stack** locally via `docker compose up`. This starts a Postgres database, a Redis instance, and runs the bot, API and web panel with live reload. Alternatively you can run individual packages with `npm run dev -w packages/bot` etc.

## Features

The platform is being developed in sprints. Each sprint adds a set of capabilities. Some features are fully implemented while others are planned.

### Sprint 1 – Skeleton

The initial sprint created the monorepo structure, configured TypeScript, ESLint and Prettier, set up Docker and environment variables, and bootstrapped the bot, API and web packages. A `/ping` command was added to verify that the bot can connect and respond.

### Sprint 2 – Moderation & Automod

Moderation tools allow staff to keep your server safe:

- Slash commands: `/mod warn`, `/mod note`, `/mod timeout`, `/mod untimeout`, `/mod kick`, `/mod ban`, `/mod unban`, `/mod softban`, `/mod case`, `/mod cases`. These actions create moderation cases via the API and optionally perform the corresponding Discord action (timeout, kick, ban, etc.).
- Automod pipeline: checks each incoming message for profanity and link spam. Violations are deleted and recorded as `DELETE_MSG` cases. Configuration (banned words, exempt roles, thresholds and escalation stages) is stored per guild.
- Prisma models and API endpoints: the API persists moderation cases, mutes, bans, warnings and logs; exposes CRUD endpoints for moderation and automod configuration; and streams logs to the web panel.
- Web panel: simple pages to view and edit moderation and automod settings.

### Sprint 3 – Community Management

Planned and partially implemented features to help build engaged communities:

- **Announcements**: schedule rich embed announcements to any channel.
- **Reminders**: create personal and guild reminders that ping at a later time.
- **Polls & Giveaways**: start timed polls with multiple options and run giveaways with automatic winner selection.
- **Reaction roles**: assign and remove roles when users react to specific emojis.
- **Welcome & Goodbye**: send welcome messages or DMs to new members and assign autoroles based on rules.
- **Starboard**: highlight popular messages by posting them to a starboard channel once they reach a threshold of star reactions.
- **Tickets & Forms**: open private support tickets and build custom forms to collect information from users.

_Note: many of these features are still under construction in the main branch._

### Sprint 4 – Music System

The bot will support high quality music playback:

- Lavalink-based voice engine with multiple search providers (YouTube, SoundCloud and radio streams).
- Queue management: play, pause, resume, skip, stop, shuffle, loop (one or all), move and remove tracks.
- Personal and guild playlists; import/export playlists and play entire lists.
- DJ role enforcement and vote-to-skip options.
- Autoplay and radio modes; bass boost and other audio filters.
- Lyrics lookup and a now playing display.
- Web panel pages to view the queue, manage settings and control playback.

### Sprint 5 – Economy & RPG

A customisable economy and role–playing foundation:

- Currency system with wallets and bank accounts, daily/work payouts, taxes and fees.
- Jobs, shop items, crafting, resource gathering and marketplaces/auctions.
- Redeem codes, VIP tiers and leaderboards.
- Character profiles with classes, stats, levels and energy.
- Skills, enemies and loot tables; quests (daily, weekly, story) and quest progress.
- PvE encounters, PvP duels and party-based dungeon runs with turn based combat.
- Administrative panels to configure items, jobs, recipes, quests, enemies, dungeons and seasons.

### Sprint 6 – AI & Smart Systems

Add intelligent helpers and content tools:

- AI chat command that uses LLMs to answer questions in chat with configurable system profiles and prompt templates.
- Commands to translate text, summarise long posts into TL;DRs, rewrite messages in different tones, and generate images from prompts.
- Safety moderation for text and images with configurable policies, blocked words and exemptions.
- Budget and quota management: limit monthly spend per guild and per-user quotas; automatically stop processing when limits are reached.
- Caching of AI results, request tracing, cost estimation and live usage analytics.
- Web panel to edit AI providers, policies, budgets, templates and profiles; monitor usage and image jobs.

### Sprint 7 – Integrations & Analytics

Planned external integrations and reporting:

- Connectors for Twitch, YouTube, Twitter, Reddit, Steam and RSS feeds to post updates in your server.
- Track cryptocurrency and stock prices, weather, and other external data via APIs.
- Stream logs and metrics to the web panel; searchable audit trail for all actions.
- Export reports and view analytics about moderation actions, messages and member activity.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests. When submitting changes please follow the established coding style and ensure tests pass.

---

# terminal-x (Türkçe)

Terminal-X, monorepo yapısında modüler bir Discord bot platformudur. Bir Discord botu, bir REST API servisi, paylaşılan tip tanımları için bir modül ve sunucu sahipleri ile moderatörlerin tüm yapılandırmayı yönetebileceği modern bir web paneli sunar.

## Paketler

- **@terminal-x/bot** – [discord.js](https://discord.js.org) kullanan Discord botu. Slash komutlarını kaydeder, olayları dinler, izin ve hız sınırlarını uygular ve API ile iletişim kurar.
- **@terminal-x/api** – Yapılandırma uç noktalarını sağlayan, moderasyon ve otomasyon mantığını işleyen ve verileri Prisma/PostgreSQL üzerinde saklayan NestJS tabanlı REST API. Ayrıca Discord OAuth2 ile giriş yapar ve web paneli için JWT üretir.
- **@terminal-x/shared** – Bot, API ve web paketlerinin kullandığı ortak TypeScript tipleri, Zod şemaları, enumlar ve sabitler.
- **@terminal-x/web** – Tailwind ile tasarlanan Next.js 14 yönetim paneli. Sunucu sahiplerinin ve moderatörlerin Discord ile giriş yapmasını, istatistikleri görüntülemesini ve özellikleri gerçek zamanlı olarak ayarlamasını sağlar.

## Başlarken

1. **Depoyu klonlayın** ve kök dizinde `npm install` ile bağımlılıkları yükleyin. Npm workspaces ile paketler birlikte hazırlanır.
2. **Ortamı ayarlayın**: `.env.example` dosyasını `.env` olarak kopyalayıp değerleri doldurun. Discord geliştirici portalından bir bot token’ı, client ID ve secret, ayrıca Postgres ve Redis bağlantı adresleri gereklidir.
3. **Yığını çalıştırın**: `docker compose up` komutu ile Postgres, Redis, bot, API ve web panelini canlı yenileme ile başlatabilirsiniz. Alternatif olarak her paketi ayrı ayrı `npm run dev -w packages/bot` vb. ile çalıştırabilirsiniz.

## Özellikler

Geliştirme sprintler hâlinde ilerlemektedir. Her sprint yeni yetenekler ekler. Bazı özellikler tamamlanmış, bazıları planlama aşamasındadır.

### Sprint 1 – İskelet

Bu sprint, monorepo yapısını oluşturdu, TypeScript, ESLint ve Prettier’i yapılandırdı, Docker ve ortam değişkenlerini kurdu ve bot, API ve web paketlerini başlattı. Bağlantıyı doğrulamak için `/ping` komutu eklendi.

### Sprint 2 – Moderasyon ve Otomatik Moderasyon

- Slash komutları: `/mod warn`, `/mod note`, `/mod timeout`, `/mod untimeout`, `/mod kick`, `/mod ban`, `/mod unban`, `/mod softban`, `/mod case`, `/mod cases`. Bu eylemler API üzerinden moderasyon vakası yaratır ve gerekirse Discord ücþsinçe için karşılık gelen işlemi (timeout, kick, ban, vb.) uygular.
- Otomatik moderasyon: her mesajı küfür ve link spam’i için kontrol eder. İhlaller silinir ve `DELETE_MSG` vakası olarak kaydedilir. Yasaklı kelimeler, muaf roller, eşikler ve kademeli yaptırımlar sunucu bazında saklanır.
- Prisma modelleri ve API uç noktaları: moderasyon vakalarını, susturmaları, ban’leri, uyarıları ve logları saklar; moderasyon ve automod yapılandırması için CRUD uç noktaları sağlar; logları web paneline akıtır.
- Web paneli: moderasyon ve automod ayarlarını görüntülemek ve düzenlemek için basit sayfalar.

### Sprint 3 – Topluluk Yönetimi

Topluluğunuzu büyütmenize yardımcı olacak özellikler (planlanan ve kısmen uygulanmış):

- **Duyurular**: herhangi bir kanalda zengin embed duyuruları planlayıp gönderin.
- **Hatırlatıcılar**: kişisel veya sunucu bazlı hatırlatıcılar oluşturarak belli bir zamanda pingleyin.
- **Anketler ve Çekilişler**: çok seçenekli anketler başlatın ve otomatik kazanan seçimiyle çekilişler yapın.
- **Reaksiyon roller**: kullanıcılar belirli emojilere tepki verdiğinde roller verin veya geri alın.
- **Hoş geldin & Güle güle**: yeni üyelere karşılama mesajı veya DM gönderin ve kurallara göre otomatik rol atayın.
- **Starboard**: belirli sayıda yıldız reaksiyonu alan popüler mesajları starboard kanalında öne çıkarın.
- **Destek biletleri ve Formlar**: özel destek biletleri açın ve kullanıcılardan bilgi toplamak için özel formlar oluşturun.

_Bu özelliklerin birçoğu ana dalda hâlen geliştirme aşamasındadır._

### Sprint 4 – Müzik Sistemi

Yüksek kaliteli müzik dinletisi sağlayacak özellikler:

- Lavalink tabanlı ses motoru, YouTube, SoundCloud ve radyo akışları gibi arama sağlayıcılar.
- Kuyruk yönetimi: çalma, duraklatma, devam, atlama, durdurma, karıştırma, döngü (tek veya tüm), taşıma ve silme.
- Kişisel ve sunucu çalma listeleri; listeleri içe/dışa aktarma ve bir listeyi tamamen oynatma.
- DJ rolü ve oylamayla atlama seçenekleri.
- Otomatik oynatma ve radyo modları; bas artırma ve diğer ses filtreleri.
- Şarkı sözleri arama ve “şu an çalan” gösterimi.
- Kuyruğu görüntülemek, ayarları yönetmek ve çalmayı kontrol etmek için web paneli sayfaları.

### Sprint 5 – Ekonomi ve RPG

Özelleştirilebilir ekonomi ve rol yapma temeli:

- Cüzdan ve banka hesaplarıyla para birimi sistemi, günlük/çalışma gelirleri, vergiler ve kesintiler.
- Meslekler, mağaza ürünleri, üretim, kaynak toplama ve pazar/açık artırmalar.
- Kodlar, VIP seviyeleri ve liderlik tabloları.
- Sınıf, istatistik, seviye ve enerji içeren karakter profilleri.
- Yetenekler, düşmanlar ve ganimet tabloları; günlük, haftalık ve hikâye görevleri.
- PvE karşılaşmalar, PvP düellolar ve grupla girilen zindanlarda tur bazlı savaş.
- Eşyalar, meslekler, tarifler, görevler, düşmanlar, zindanlar ve sezonlar için yönetim panelleri.

### Sprint 6 – Yapay Zekâ ve Akıllı Sistemler

Akıllı yardımcılar ve içerik araçları ekleyin:

- Yapay zekâ sohbet komutu; yapılandırılabilir sistem profilleri ve prompt şablonları ile LLM’ler kullanarak soruları yanıtlar.
- Metin çevirme, uzun mesajları özetleme (TL;DR) ve farklı tonlarda tekrar yazma komutları, ile istemden görsel üretme.
- Metin ve görseller için güvenlik modları; yapılandırılabilir politikalar, engelli kelimeler ve istisnalar.
- Bütçe ve kota yönetimi: sunucu başına aylık harcama sınırları, kullanıcı başına günlük/haftalık kotalar; limit aşıldığında işlemler durur.
- Yapay zekâ sonuçlarının önbelleğe alınması, istek izleme, maliyet hesaplama ve canlı kullanım analitiği.
- Sağlayıcı, politika, bütçe, şablon ve profil ayarlarını düzenlemek ve kullanım ile görsel isteklerini takip etmek için web paneli.

### Sprint 7 – Entegrasyonlar ve Analitik

Planlanan harici entegrasyonlar ve raporlama:

- Twitch, YouTube, Twitter, Reddit, Steam ve RSS akışları için bağlayıcılar; bu platformlardaki yeni içerikleri sunucunuza aktarın.
- Kripto para ve hisse senedi fiyatları, hava durumu ve diğer dış verileri API’ler üzerinden takip edin.
- Tüm eylemler için arama yapılabilir denetim kaydı ve loglar; web panelinde canlı metrikler.
- Raporları dışa aktarın ve moderasyon, mesajlar ve üye etkinliği hakkında analitikler görüntüleyin.

## Katkıda Bulunma

Katkılar memnuniyetle karşılanır! Issue veya pull request açabilirsiniz. Değişiklik gönderirken var olan kod tarzına uyun ve testlerin geçtiğinden emin olun.
