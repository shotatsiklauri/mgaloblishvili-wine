# Project Blueprint — Polyglot gRPC Microservices on AWS (Polyrepo)

> Audience: 2 backend devs. Stack: **Go** (gateway, auth, core, search), **Python** (scraper, AI), **TypeScript** (frontend). Internal transport: **gRPC**. Cloud: **AWS**.
>
> **Architecture: true microservices — every service is its own repo, its own image, deployed independently, talking over gRPC.** (Same shape as MediDrive's `nemt-*` repos.)
>
> Answers: (1) what repos + how to dockerize + the proto question, (2) AWS deployment + SST, (3) the full build checklist.

---

## 0. System at a glance

```
                          Browser (React/TS)
                                 │  HTTPS  (REST or gRPC-Web + JWT)
                                 ▼
                        ┌──────────────────┐   ← public ALB (the ONLY public entry)
                        │   gateway (Go)   │
                        └────────┬─────────┘
                                 │  gRPC (private, Cloud Map DNS)
        ┌──────────────┬─────────┼──────────┬───────────────┐
        ▼              ▼         ▼          ▼               ▼
   auth-service    core-svc   search-svc  ai-service    scraper-svc
      (Go)          (Go)        (Go)        (Py)           (Py)
        │              │          │
        ▼              ▼          ▼
     Postgres      Postgres   Meilisearch / OpenSearch
                      │              ▲
                      │ change       │ index events
                      └─events──► SQS/SNS (or NATS) ──┘
```

**Each box above = one Git repo + one Docker image + one Fargate service, released on its own.** They share nothing at the code level except the **proto contract** (and optionally a small **shared-libs** module).

| Service | Lang | Repo | Public? | Responsibility |
|---|---|---|---|---|
| **gateway** | Go | `myproject-gateway` | ✅ ALB | Single edge. TLS, CORS, JWT validation, RBAC, REST↔gRPC translation, rate limit. No business logic. |
| **auth-service** | Go | `myproject-auth` | ❌ | Login, signup, JWT issue/refresh, password reset. Owns credential tables. |
| **core-service** | Go | `myproject-core` | ❌ | Business brain. Owns entities, orchestrates scrape/AI jobs, persists results, emits change events. |
| **search-service** | Go | `myproject-search` | ❌ | Read model for filter/sort/facet-heavy tables. Consumes change events → indexes → serves search. |
| **scraper-service** | Py | `myproject-scraper` | ❌ | Pulls external data. Stateless worker. |
| **ai-service** | Py | `myproject-ai` | ❌ | Runs analysis/inference. Stateless worker. |

---

# PART 1 — Repositories, Docker, and the Proto Question

## 1.1 The repo list (polyrepo)

```
myproject-proto        # THE contract. .proto files + buf. Publishes stubs for Go/Py/TS.   ← nemt-proto equivalent
myproject-libs         # (optional, Go) shared logger/config/interceptors/errors.          ← nemt "tools" equivalent
myproject-gateway      # Go   — public edge
myproject-auth         # Go   — auth-service
myproject-core         # Go   — core-service
myproject-search       # Go   — search-service
myproject-scraper      # Py   — scraper-service
myproject-ai           # Py   — ai-service
myproject-frontend     # TS   — web app
myproject-infra        # IaC  — ONE repo, deploys ALL services (SST / Copilot / Terraform)
myproject-dev          # (optional) docker-compose that boots the whole system locally
```

**Dependency graph** (everything points at the contract):

```
myproject-proto ─────────────┐  (every service depends on the contract)
myproject-libs ──────┐       │
                     ▼       ▼
  Go services   →  go get myproject-libs + myproject-proto stubs
  Py services   →  pip install myproject-proto stubs
  frontend      →  npm install myproject-proto stubs
```

### Two repos to get right first, before any service

1. **`myproject-proto`** — your `nemt-proto`. The single source of truth for every gRPC contract. **Build this first.** Everything depends on it.
2. **`myproject-infra`** — the single IaC repo. One config, all services (see Part 2). **Not** one infra config per service.

> A Go **shared-libs** repo (`myproject-libs`) is optional but you'll grow one — exactly like MediDrive's `tools`. Logger, config loader, gRPC interceptors (auth, logging, request-id), error helpers. Version it with semver tags, same as proto.

## 1.2 The proto repo — your `nemt-proto`, and how Go + Python + TS each consume it

In polyrepo you **need** a dedicated proto repo. It is the contract hub. One `.proto` → stubs for all three languages. This is exactly why gRPC fits polyglot: the wire contract is language-neutral.

```
myproject-proto/
├── proto/
│   ├── auth/v1/auth.proto
│   ├── core/v1/core.proto
│   ├── search/v1/search.proto
│   ├── scraper/v1/scraper.proto
│   └── ai/v1/ai.proto
├── buf.yaml            # module + lint + breaking-change rules
├── buf.gen.yaml        # codegen targets (Go / Python / TS)
└── .github/workflows/  # lint + breaking-check + publish on tag
```

### Distribution — pick ONE of these

**Option A — Buf Schema Registry (BSR) [recommended for polyglot].**
Push the proto repo to BSR; it **auto-generates and hosts** a Go module, a Python package, and an npm package. No generated code committed anywhere.

```bash
# in myproject-proto, on a release
buf push                       # publishes to buf.build/you/myproject
```
```go
// Go service go.mod
go get buf.build/gen/go/you/myproject/grpc/go@latest
go get buf.build/gen/go/you/myproject/protocolbuffers/go@latest
```
```bash
# Python service — BSR's pip registry
pip install myproject-protocolbuffers-python --extra-index-url https://buf.build/gen/python
```
```bash
# frontend — BSR's npm registry
npm install @buf/you_myproject.bufbuild_es
```

**Option B — generate-and-tag, consume via native package managers [no BSR].**
Proto repo runs `buf generate` in CI and commits `gen/`, tagged semver. This is the literal MediDrive pattern you already know.

```go
// Go — import straight from the proto repo (it's a Go module)
go get github.com/you/myproject-proto/gen/go@v1.4.0
```
```bash
# Python — pip from git tag (or push to private PyPI / CodeArtifact)
pip install "git+https://github.com/you/myproject-proto@v1.4.0#subdirectory=gen/python"
```
```bash
# frontend — npm from git tag (or private npm / CodeArtifact)
npm install github:you/myproject-proto#v1.4.0
```

> **Recommendation:** BSR if you want the cleanest polyglot story (no committed stubs, hosted SDKs per language). Option B if you'd rather own everything and stay close to the `go get <proto>@<tag>` flow from NEMT. Both work; BSR saves you the "publish a Python package from a Go-centric repo" annoyance.

### Your exact question, answered

Yes — a Go-defined `user.proto` is consumed by Python (and vice versa). The proto **does not belong to Go**; it belongs to the contract. Python imports the generated Python stub, implements the server; Go imports the generated Go client and calls it. Direction is symmetric: Python scrapes → calls `core.IngestData()` (Go server); Go dispatches work → calls `scraper.Scrape()` (Python server). Wire-compatible because both came from the same `.proto`.

### The cost of polyrepo: versioning discipline (you know this from NEMT)

Because services deploy independently, **mixed-version operation is the default, not the exception** — same reality as `nemt-proto`'s 50+ importers. Non-negotiables in the proto repo's CI:

- `buf lint` + **`buf breaking`** on every PR. Field numbers are forever; reserve removed ones.
- **Semver tags.** Additive changes = minor; never reuse field numbers; new enum values audited against every `switch`.
- Each service **pins a proto version** and bumps deliberately. A contract change ships as: publish proto → consumers bump one at a time → mixed-version safe at each step.

This is the tax you pay for independent deploys. You've paid it before; it's the right tax for true microservices.

## 1.3 Dockerizing correctly — per-repo, self-contained

In polyrepo each service builds from **its own repo as the context**. Generated stubs arrive via `go mod download` / `pip install` (from BSR or git tag) — so there's **no cross-repo build context and no `gen/` copying**. This actually makes Dockerfiles cleaner than monorepo.

**Principles:** multi-stage; deps-before-source for layer caching; non-root; smallest base (distroless for Go, slim for Python); **one process per container** (don't run `pm2` with 5 instances in one container like TradeCafe's searchservice — run separate Fargate tasks); `.dockerignore`; gRPC healthcheck.

### Go service — `myproject-core/Dockerfile`

```dockerfile
# ---- build ----
FROM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download            # pulls myproject-proto + myproject-libs (BSR / git tag)
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /bin/server ./cmd/server

# ---- runtime ----
FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /bin/server /server
USER nonroot:nonroot
EXPOSE 50051
ENTRYPOINT ["/server"]
```
~15–25 MB image, non-root, no shell.

### Python service — `myproject-scraper/Dockerfile`

```dockerfile
# ---- build ----
FROM python:3.12-slim AS build
WORKDIR /app
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .        # includes the published proto package
RUN pip install --no-cache-dir -r requirements.txt

# ---- runtime ----
FROM python:3.12-slim
RUN useradd --create-home --uid 10001 appuser
COPY --from=build /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" PYTHONUNBUFFERED=1
WORKDIR /app
COPY . .                       # just THIS service's code
USER appuser
EXPOSE 50054
CMD ["python", "-m", "app.server"]
```

### `.dockerignore` (each service repo)

```
.git
**/__pycache__
**/*.pyc
.venv
**/dist
**/.env*
Dockerfile
README.md
```

### Local dev across repos — the orchestration repo (TradeCafe's pattern)

The one real downside of polyrepo: `docker compose up` in a single service repo won't boot the system. Solve it the way TradeCafe did — a small **`myproject-dev`** repo whose compose builds from **sibling-cloned** service repos:

```yaml
# myproject-dev/docker-compose.yml   (clone all repos side-by-side as siblings)
services:
  postgres:    { image: postgres:16-alpine, environment: { POSTGRES_PASSWORD: dev, POSTGRES_DB: app }, ports: ["5432:5432"] }
  meilisearch: { image: getmeili/meilisearch:v1.10, environment: { MEILI_MASTER_KEY: dev }, ports: ["7700:7700"] }
  nats:        { image: nats:2-alpine, ports: ["4222:4222"] }

  gateway:
    build: { context: ../myproject-gateway }
    ports: ["8080:8080"]
    depends_on: [auth, core]
  auth:
    build: { context: ../myproject-auth }
    environment: { DB_DSN: "postgres://postgres:dev@postgres:5432/app?sslmode=disable" }
    depends_on: [postgres]
  core:
    build: { context: ../myproject-core }
    environment: { DB_DSN: "...", NATS_URL: "nats://nats:4222" }
    depends_on: [postgres, nats]
  # scraper / ai / search added the same way
```

(TradeCafe's compose did exactly this: `build: { context: "${PWD}/searchservice" }` against sibling dirs.) Clone all repos into one folder, `cd myproject-dev && docker compose up`.

---

# PART 2 — AWS Deployment & SST

## 2.1 The `sst.go` / `sst.py` question — answered

**There is no `sst.go` or `sst.py`. SST's config is always TypeScript: `sst.config.ts`.** (Verified against current SST docs.)

That does **not** mean SST is TS-only for apps. SST deploys **Go and Python services fine** — it just *describes* infra in TypeScript and points at your `Dockerfile`. App language and IaC language are independent.

```typescript
// myproject-infra/sst.config.ts — ONE file, describes ALL services (each built from its own repo)
export default $config({
  app: (input) => ({ name: "myproject", removal: input.stage === "production" ? "retain" : "remove", home: "aws" }),
  async run() {
    const vpc     = new sst.aws.Vpc("Vpc", { nat: "ec2" });
    const cluster = new sst.aws.Cluster("Cluster", { vpc });

    // internal Go service — private, discoverable via Cloud Map, NO public LB
    const auth = new sst.aws.Service("Auth", {
      cluster,
      image: "<ECR-image-uri-built-in-the-auth-repo-CI>",   // or build from a checked-out path
    });

    const scraper = new sst.aws.Service("Scraper", {
      cluster,
      image: "<ECR-image-uri-from-scraper-repo-CI>",
    });

    // the ONE public service: gateway behind an ALB
    new sst.aws.Service("Gateway", {
      cluster,
      image: "<ECR-image-uri-from-gateway-repo-CI>",
      link: [auth, scraper],                                 // injects their Cloud Map hostnames
      loadBalancer: { ports: [{ listen: "443/https", forward: "8080/http" }] },
    });
  },
});
```

**In polyrepo, each service's own CI builds + pushes its image to ECR; the infra repo references those image URIs.** That keeps build (per-service repo) and deploy (one infra repo) cleanly separated.

If you specifically want to **write infrastructure in Go or Python**, SST is the wrong tool:

| Want IaC in… | Use | Notes |
|---|---|---|
| TypeScript | **SST** or AWS CDK | SST = highest-level DX |
| **Go** | **AWS CDK for Go** (`aws-cdk-go`) or **Pulumi Go SDK** | Real Go IaC — what "sst.go" would be |
| **Python** | AWS CDK for Python or Pulumi Python | — |
| YAML, minimal | **AWS Copilot** | Purpose-built for "containers on Fargate"; lowest config |
| HCL | Terraform / OpenTofu | Most portable |

## 2.2 One infra config, or one per repo?

**One.** Even though every *service* is its own repo, **infrastructure is a single coherent graph** — one VPC, one cluster, services that discover each other. Put the single config in **`myproject-infra`**. One per service would duplicate VPC/cluster wiring and break atomic "deploy auth + the gateway that links it."

So the split is:
- **Per-service repo** → owns code, Dockerfile, its own CI (build + push image to ECR).
- **`myproject-infra` (one repo)** → owns the single IaC config; deploys all services by referencing their ECR images.

## 2.3 What to deploy on (the gRPC-relevant part)

- **Compute: ECS Fargate.** Long-running containers, no servers. (Not Lambda — your internal mesh is persistent gRPC.)
- **Internal services: private, via AWS Cloud Map service discovery.** SST/Copilot give each service a Cloud Map hostname; with no load balancer it's VPC-private. Gateway dials `dns:///auth.myproject.local:50051` — clean client-side gRPC load balancing. (AWS analog of MediDrive's `xds://`.)
- **Public edge: exactly one ALB** in front of the **gateway only** (HTTP/2 → gRPC-Web + REST both terminate here). Everything else stays private.

**Recommendation for 2 devs:** **AWS Copilot** (lowest config, purpose-built for Fargate microservices, auto-wires Cloud Map + ALB), or **SST** if you want TS infra + frontend together, or **CDK-Go** if you want infra in Go. All deploy the same Fargate + Cloud Map runtime.

---

# PART 3 — Everything You Need (full checklist)

## 3.1 Foundation (week 1) — contract + infra first

- [ ] **`myproject-proto`** repo: `buf.yaml` + `buf.gen.yaml`, `buf lint` + **`buf breaking`** in CI, semver tags, publish (BSR or git-tag). One `.proto` per service under `<service>/v1/`. **Build this before any service.**
- [ ] **`myproject-libs`** (Go, optional): logger, config, gRPC interceptors, error helpers. Semver-tagged.
- [ ] **`myproject-infra`** repo: single SST/Copilot/Terraform config (VPC + cluster + services + ALB at gateway).
- [ ] **`myproject-dev`** repo: docker-compose booting the whole system from sibling repos (+ Postgres, Meilisearch, NATS).

## 3.2 The services (weeks 1–3) — one repo each

- [ ] **gateway** — `chi` OR **`connect-go`** (one handler serves REST + gRPC-Web — worth it). Per-domain route files, per-endpoint handler files (copy TradeCafe's structure). JWT + RBAC + request-id + recover middleware, structured logs, Prometheus, graceful shutdown.
- [ ] **auth** — `Login`/`Refresh`/`Logout`. JWT (`golang-jwt/jwt/v5`), short access (~15m) + refresh. Owns `auth.*` schema.
- [ ] **core** — domain entities + 1–2 list endpoints with `repeated Filter`. `pgx` + `sqlc` (typed) or `goqu` (dynamic filters). Emits change events on writes (outbox — see 3.4).
- [ ] **scraper** (Py) — `grpcio` server, `Scrape` RPC. Scrapy/Playwright/httpx.
- [ ] **ai** (Py) — `grpcio` server, `Analyze` RPC.

Each repo: standard internal layout (e.g. `cmd/server`, `internal/...` for Go; `app/` for Py), own Dockerfile, own CI → ECR.

## 3.3 Data layer

- [ ] **Postgres** (RDS, or **Aurora Serverless v2**). **One database, schema-per-service** (`auth.*`, `core.*`) at this size. Each service owns and migrates its own schema — there is **no shared DB-model repo** (no `nemt-objects` equivalent; that's a Spanner-specific thing).
- [ ] **Migrations per service repo** — `goose`/`golang-migrate` (Go), `alembic` (Py).
- [ ] **Redis/Valkey** (ElastiCache) for cache/sessions — not day one.

## 3.4 Async / change events (Py↔Go + search-sync backbone)

1. **Py → Go ingest:** start with **sync gRPC** (Python calls `core.IngestData()`). Shape it as a *push RPC* (`IngestScrapedData`) with a `job_id` from day one, so swapping to a queue later is transport-only.
2. **Core → search sync:** core emits a change event; search consumes and reindexes.

| Bus | Ops | When |
|---|---|---|
| **AWS SQS + SNS** | Zero (managed) | **Recommended on AWS.** SNS fan-out → SQS per consumer. |
| **EventBridge** | Zero | Good for many event types / routing rules. |
| **NATS** (JetStream) | One container | Simplest local. |
| Postgres LISTEN/NOTIFY + outbox | None extra | Smallest MVP. |
| Kafka | High | Only at real scale. Not now. |

**Use the outbox pattern** (you know it from MediDrive's Spanner outbox): write the business row + an `outbox` row in the same Postgres tx; a relay publishes to SQS/NATS. No lost events on crash.

## 3.5 Search (only when filtering hurts)

You flagged "lots of tables, lots of filters" — TradeCafe solved this with **Elasticsearch as a read model** (Postgres = source of truth, ES = query engine). Replicate the *pattern*, not the heavy stack:

- **MVP: no search service.** Dynamic `WHERE` in core via `goqu`/`sqlc`. Fine until facet counts + full-text + combinatorial filters get slow.
- **When it hurts: `myproject-search` (Go) + Meilisearch/Typesense** (single binary, trivial ops). Consume the change events from 3.4.
- **At scale: OpenSearch.** Port TradeCafe's **per-entity index map** (declare each field's type / query-type EXACT|MATCH|RANGE|REGEX / aggregation once → filter+sort+facet for free):

```go
var DealIndexMap = index.MapType{
  "eta":          {Type: index.Long,   QueryType: index.Range, Aggr: &index.MinMax{}},
  "carrier_name": {Type: index.String, QueryType: index.Exact, Aggr: &index.Unique{}}, // facet
  "buyer_id":     {Type: index.String, QueryType: index.Exact, Path: "buyer.id"},
}
```

- **Multi-instance from one image** (TradeCafe's good idea): `cmd/api`, `cmd/listener`, `cmd/reindex` share `internal/`; same image, different entrypoint by env — but as **separate Fargate tasks**, not `pm2` in one container.

**Design the seam now:** the gateway calls `Search<Entity>` gRPC from day one. Core implements it against Postgres today; search-service swaps in against Meilisearch later. Caller never changes — that's the cheap insurance.

## 3.6 Auth & security

- [ ] **JWT verified at the gateway**; identity forwarded to internal services via gRPC metadata. Internal services **trust** gateway-injected identity — don't re-verify per service.
- [ ] **RBAC** middleware in the gateway (TradeCafe's `validToken` / `is_tradecafe()` pattern).
- [ ] **Secrets** in **AWS Secrets Manager / SSM** — injected at runtime, never in images or git. (Same idea as your LetterStream `tools/config` + Secret Manager work, AWS flavor.)
- [ ] **TLS** at the ALB. Internal gRPC plaintext within VPC for MVP; mTLS later if needed.

## 3.7 Observability

- [ ] **Structured JSON logs** with `request_id`/`trace_id` propagated through gRPC metadata across every hop.
- [ ] **OpenTelemetry** traces (TradeCafe inits OTel first in `app.js` — copy that) → X-Ray or Grafana Tempo.
- [ ] **Prometheus** `/metrics` per service → Grafana/CloudWatch.
- [ ] **gRPC health** (`grpc_health_probe`) on every service for Fargate health checks.

## 3.8 CI/CD — per-repo build, one-repo deploy

- [ ] **Each service repo** has its own GitHub Actions: (proto stubs already published) → lint → test → `docker build` → push to **ECR** (tag = git SHA + semver).
- [ ] **`myproject-proto`** CI: `buf lint` + `buf breaking` + publish on tag. This gate protects every consumer.
- [ ] **`myproject-infra`** CI: `sst deploy` / `copilot svc deploy` / `terraform apply`, referencing the latest ECR image tags.
- [ ] Environments: `dev` → `staging` → `prod` (SST stages / Copilot envs).
- [ ] **Mixed-version rollout is real** — deploy one service at a time; never assume all services run the same proto version simultaneously (your NEMT lesson).

## 3.9 Recommended build order

1. **`myproject-proto`** — stub `auth/v1/auth.proto` (`Login` only), buf lint/breaking CI, publish v0.1.0.
2. **`myproject-infra`** — minimal: VPC + cluster + ECR. (Stand up the skeleton early.)
3. **auth** repo — `Login`, hardcoded user, issues JWT. Prove gRPC end-to-end.
4. **gateway** repo — `POST /auth/login` → calls auth via gRPC. Frontend can sign in.
5. **core** repo — one entity, `List<Entity>` with `repeated Filter`, Postgres. Gateway mounts `/entity`.
6. **scraper + ai** repos (Py) — gRPC servers returning dummy data; core calls them sync.
7. **Outbox + SQS/NATS** in core — emit change events (produce only; ~an afternoon).
8. Replace dummy logic with real scraping/AI/business logic.
9. **search** repo + Meilisearch — *only when* core's Postgres filtering hurts. Consume events from step 7; gateway routes `/entity/search` to it.

Steps 1–6 ≈ 2–3 weeks for two devs. Step 7 ≈ an afternoon. Step 9 only when needed.

---

## Tech stack summary

| Concern | Pick | Alt |
|---|---|---|
| Repo model | **polyrepo — one repo per service** | monorepo |
| Proto tooling | **buf** + **BSR** (publish stubs) | buf + git-tag + go get/pip/npm |
| Go gRPC/REST edge | **connect-go** | chi + grpc-go |
| Go DB | **pgx + sqlc** | goqu (dynamic), GORM |
| Go migrations | **goose** | golang-migrate |
| Python gRPC | **grpcio + grpcio-tools** | — |
| Shared Go libs | **myproject-libs** (semver) | inline per service |
| Message bus | **SQS+SNS** (AWS) / **NATS** (local) | EventBridge, Kafka (scale) |
| Search | **Meilisearch** → OpenSearch | Postgres-only (MVP) |
| DB | **Aurora Serverless v2 / RDS Postgres** | — |
| Compute | **ECS Fargate** | EKS (scale), App Runner |
| Service discovery | **AWS Cloud Map** (DNS gRPC) | — |
| IaC (one repo) | **Copilot** (YAML) / **SST** (TS) / **CDK-Go** (Go) | Terraform/Pulumi |
| Secrets | **AWS Secrets Manager / SSM** | — |
| Observability | **OpenTelemetry + Prometheus** | — |
| CI/CD | **per-repo → ECR; infra repo deploys** | — |

## Decisions to lock before writing code

1. **Proto distribution** → BSR (cleanest polyglot) vs git-tag + `go get`/`pip`/`npm` (NEMT-style). Pick one.
2. **Shared Go libs** → start `myproject-libs` now, or inline until duplicated 3×?
3. **IaC tool** → Copilot (minimal) / SST (TS) / CDK-Go (Go infra). All → Fargate + Cloud Map, one infra repo.
4. **Py→Go transport** → sync gRPC now, async-ready proto shape (push RPC + `job_id`).
5. **Search now or later** → later, but put the `Search<Entity>` gRPC seam in the gateway from day one.
6. **DB topology** → one Postgres, schema-per-service. Split later if needed.
7. **Auth** → JWT verified at gateway, trusted downstream.

---

### TL;DR

- **Repos:** true microservices — **one repo per service**, plus **`myproject-proto`** (your `nemt-proto`), **`myproject-infra`** (one IaC repo for all), optional **`myproject-libs`** (your `tools`) and **`myproject-dev`** (compose that boots everything from sibling repos). No `nemt-objects` equivalent needed.
- **Proto:** dedicated proto repo is the contract hub. One `.proto` → Go + Python + TS stubs via **buf**, distributed through **BSR** (or git-tag + `go get`/`pip`/`npm`). Python and Go call each other freely. Pay the versioning tax (`buf breaking`, semver, mixed-version rollout) — you know it from NEMT.
- **Docker:** per-repo context, stubs from the published proto package (no cross-repo copying), multi-stage, distroless (Go) / slim+venv (Py), non-root, one process per container. Local dev via a compose orchestration repo (TradeCafe pattern).
- **AWS/SST:** **no `sst.go`/`sst.py`** — SST config is always `sst.config.ts` (TypeScript) but deploys Go/Py containers fine. **One** infra repo, never per-service. Runtime = **ECS Fargate + Cloud Map** for private gRPC, one public ALB at the gateway. Want Go infra? **CDK-Go** or **Pulumi**.
- **Build order:** proto → infra skeleton → auth → gateway → core → Py stubs → outbox/events → real logic → search-when-it-hurts.
