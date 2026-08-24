# HMAX Unified — Product Requirements Document

**Product:** HMAX Unified — AI-led Service Experience Platform  
**Client:** Hitachi Energy  
**Status:** Draft v1.0 — Pending stakeholder review  
**Date:** August 2026  
**Audience:** Design & engineering reference

> CONFIDENTIAL — Internal Hitachi Energy use only

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals and Success Metrics](#2-goals-and-success-metrics)
3. [Users and Role Definitions](#3-users-and-role-definitions)
4. [Four Core Jobs](#4-four-core-jobs)
5. [Product Architecture](#5-product-architecture)
6. [AI Conversation Layer](#6-ai-conversation-layer)
7. [System Integrations](#7-system-integrations)
8. [Feature Requirements](#8-feature-requirements)
9. [Key User Flows](#9-key-user-flows)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Open Questions](#11-open-questions)
12. [Out of Scope — Phase 1](#12-out-of-scope--phase-1)

---

## 1. Executive Summary

HMAX Unified replaces a fragmented system landscape (SAP · Salesforce · Fiori · RelCare · OneIB) with a single AI-led platform. The same underlying data is presented through a role-specific lens — Sales sees pipeline, PM sees execution risk, Reliability sees asset condition, Ops sees resource capacity — with an AI conversation layer for natural language retrieval and action.

### 1.1 Problem Statement

> "We are promoting a digital business but executing with an analog system." — Renato Milanese, Operations Manager, NAM

Every user currently operates a manual data integration layer in their head: pulling exports, sending emails, maintaining spreadsheets to compensate for systems that don't share data. This creates margin slippage, missed invoicing triggers, scope disputes, HSE delays, and incomplete handoffs.

### 1.2 The Opportunity

A single surface connecting all five systems with role-specific views that answer each user's daily question without leaving the platform, plus a library of guided experiences (SLA offer builder, mobilisation planner, condition assessment) ensuring complex multi-step processes are completed correctly the first time.

### 1.3 Phase 1 Scope

- **In scope:** 4 roles, 5 system integrations, desktop web
- **Deferred to Phase 2:** Field Engineer, Diagnostics Specialist, Control Room views; Salesforce write-back; mobile

---

## 2. Goals and Success Metrics

### 2.1 Strategic Goals

- Eliminate manual data integration work across all four Phase 1 roles
- Reduce margin slippage by surfacing scope variations, unbilled WIP, and invoice triggers in real time
- Increase speed and completeness of sales-to-PM handoffs
- Replace parallel Excel / WhatsApp / email coordination with a single source of truth
- Build a scalable architecture that Phase 2 roles can extend without rebuilding

### 2.2 Success Metrics — Phase 1

| Metric | Baseline | Phase 1 Target |
|--------|----------|----------------|
| Service events initiated via formal case in HMAX | ~0% | ≥70% within 90 days |
| Sales-to-PM handoff completeness score | 59% avg | ≥85% avg |
| Mean time between event and PM risk awareness | Hours–days | <2 hours |
| Unbilled WIP at portfolio level | €2.1M | <€500k |
| Margin gap: as-sold vs executed | −8.4 pts | <−4 pts within 6 months |
| Time to build and send an SLA offer | 2–5 days | <4 hours |
| Daily active usage rate | 0% | ≥60% of target users |
| "Had to use another system today" rate | ~100% | <30% |

*Measured via: product analytics, quarterly user survey, financial reconciliation against pre-launch baseline.*

---

## 3. Users and Role Definitions

Role views are assigned automatically from the identity provider on first login. Users cannot self-assign roles — admin-managed only.

### 3.1 Phase 1 Roles

| Role | Default Lens | Primary Daily Question |
|------|-------------|------------------------|
| **Sales Manager** | Commercial | Can I trust my pipeline data? Can I get this offer out quickly? |
| **Project Manager** | Execution | What is at risk today? What needs escalation? |
| **Reliability Engineer** | Technical | What is technically wrong and what information is missing? |
| **Operations Manager** | Resource + contract performance | Do we have the people to execute this? Are we meeting the contract? |

#### Sales Manager cares about
Customer needs, proposal status, contract scope, commitments, quote status

#### Project Manager cares about
Milestones, cost, margin, materials, blockers, delivery status

#### Reliability Engineer cares about
Asset condition, drawings, inspection data, engineering requests

#### Operations Manager cares about
Technician availability, bookings, field activities, SLA obligations, uptime, maintenance schedule

### 3.2 Phase 2 Roles (Deferred)

- **Field Engineer / Field Service Technician** — mobile-first job view, site access, parts on site, case completion
- **Diagnostics Specialist** — evidence trail, cross-asset pattern analysis, DGA and PD data interpretation
- **Control Room / Ops Lead** — live asset monitoring, alarm-to-case creation, real-time supervision

---

## 4. Four Core Jobs

Every feature exists to enable one of these four jobs. If a user cannot accomplish all four without switching systems, the product has failed.

| # | Job | How HMAX Enables It |
|---|-----|---------------------|
| **01** | **Find the contextual information** — search, find, and retain information without switching systems | Unified data layer + AI conversation layer + role-specific widgets |
| **02** | **Know what needs attention** — identify critical risks, margin slippage, priority tasks | Attention list with rule-based flags sorted by urgency; portfolio KPIs with trend direction |
| **03** | **Know who owns what** — clear visibility on handoffs, dependencies, sign-offs | Named owner on every object; handoff completeness scoring; variation order tracking |
| **04** | **Move work forward** — execute actions and complete cross-functional tasks without leaving the platform | Guided experiences; in-platform action buttons that connect to back-end systems |

---

## 5. Product Architecture

Three structural layers — always visible, always in the same position. Content within them changes by role.

```
┌─────────────────────────────────────────────────────────┐
│  TOP NAV — branding · notifications · search · avatar   │
├──────────────────┬──────────────────────────────────────┤
│                  │                                      │
│  LEFT PANEL      │   MAIN CONTENT AREA                  │
│  (persistent)    │   Homepage / Detail view /           │
│                  │   Guided experience                  │
│  Conversation    │                                      │
│  list            │                                      │
│                  │                                      │
│  [New Convo]     │                                      │
└──────────────────┴──────────────────────────────────────┘
```

### 5.1 Shell (Persistent)

**Top navigation bar**
- Hitachi Energy + HMAX Unified branding
- Notification bell
- Global search (magnifying glass)
- User profile avatar with role badge

**Left panel**
- Persistent across all pages
- List of AI conversations (searchable, grouped by recency, user-named)
- "New Conversation" button at bottom
- Conversations initiated via "New Conversation" (blank) or star icon on KPI widget (pre-seeded with widget data context)

### 5.2 Homepage

Default landing state after login. Two zones:

**KPI Strip (top)**  
Four summary cards — current value, trend vs last period, 6-week sparkline. Star icon opens a new AI conversation scoped to that widget's data.

| Role | KPI Cards |
|------|-----------|
| Sales Manager | Active opportunities · Offers pending approval · Pipeline value · Win rate |
| Project Manager | Active contracts · Contracts at risk · Portfolio margin · On-time delivery |
| Reliability Engineer | Assets monitored · Open condition assessments · Assets with critical alarms · Avg health score |
| Operations Manager | FSE utilisation · Orders at risk · Outstanding payments · On-time delivery |

**"Assigned to You" Attention List (below KPI strip)**  
Rule-based flags sourced from connected systems. Sorted by urgency.

- **Filter bar:** Priority (All · Critical · At Risk) + Category (All · Blockers · Margin risk · Site & access · Invoice triggers) — both active simultaneously
- **Each entry:** contract/order name (hyperlink) · owner name · one-line context · 1–3 category badges
- **Expanded state:** 2–5 specific flags, each with title, one-paragraph explanation of stakes, and a primary action button
- **Action buttons:** execute directly in back-end system without navigating away from homepage

### 5.3 Left Panel — Conversations

- Named by user at creation, or auto-named from first message
- Stored and retrievable across sessions
- Searchable
- AI has access to the context of the currently viewed page
- Conversation panel and main content area visible simultaneously

### 5.4 Detail Views

- Opened by clicking any item in the attention list
- Load inline in main content area — not full-page breakouts
- Left panel remains visible
- Scoped to object type: contract · order · asset · case
- Shows user's role lens by default; other role lenses accessible via tabs

### 5.5 Guided Experiences

Accessible from: conversation panel, contextual prompts in attention list, direct navigation from detail view.

**SLA Offer Builder** (8 steps — Sales Manager)
1. Customer data (pre-populated from Salesforce if opportunity exists)
2. Asset register (pre-populated from OneIB, gaps flagged)
3. Service scope
4. Response times
5. Digital layer
6. Pricing (indicative price auto-calculated)
7. Risk and approvals
8. Offer summary → document generation

On completion: formal offer document generated + conversation record created. Actions available: generate offer doc, draft customer email, request pricing approval, write PM handover note.

**Mobilisation Planner** (6 steps — Project Manager)
1. Case
2. Scope
3. Staffing (ERP auto-populated)
4. Parts (ERP stock status)
5. Inspections
6. Schedule with conflict detection

Flags: part lead time conflicts, crew certification gaps, site access dependencies.

**Condition Assessment Workflow** (Reliability Engineer)
1. Asset selection
2. Inspection data entry
3. DGA and PD data review
4. Risk rating
5. Recommendation
6. Report generation

Pre-populates asset data from RelCare and OneIB.

---

## 6. AI Conversation Layer

General-purpose assistant with access to Hitachi Energy operational data via connected system integrations. Not a fixed-command chatbot — natural language, read access only.

### 6.1 Capabilities

| Capability | Example |
|------------|---------|
| **Data retrieval** | "Show me all contracts where the margin gap is more than 5 points" |
| **Contextual awareness** | Pre-seeded from KPI widget or currently viewed detail page |
| **Document generation** | "Draft the customer email for the Xcel Energy offer" |
| **Guided experience initiation** | "Start a mobilisation plan for CASE-7822" |
| **General assistance** | Writing, summarising, reasoning, calculation |
| **Cross-role queries** | PM can ask "What did sales promise the customer on scope?" — retrieves Salesforce data |

### 6.2 Data Access Scope

- **Read access only** to all five connected systems within user's permissions
- **No write access** — actions are executed via action button layer, which logs to the appropriate system
- **Role-scoped** — AI will not surface data the user cannot see in the source system
- Permission inheritance enforced at integration layer

### 6.3 Conversation Persistence

- All conversations saved automatically
- Left panel shows up to 50 recent conversations; search available across full history
- Conversations shareable — recipient sees read-only; can open a copy to continue

### 6.4 Guided Experience Conversations

Completing a guided experience automatically creates a linked conversation record containing full context. User can continue (e.g. "redraft the executive summary with a more aggressive tone") without re-entering the guided flow.

---

## 7. System Integrations

Phase 1 requires live read integration with all five systems before production use. The platform has no standalone operational data store — it is a presentation and action layer.

| System | Type | Data Consumed | Write-back Actions |
|--------|------|---------------|-------------------|
| **SAP** | Read + Write | Contract data, cost actuals, milestone status, invoice status, POs, work orders, warehouse stock | Raise PO, trigger milestone invoice, update COTD, create work order |
| **Salesforce** | Read only | Opportunity pipeline, offer status, account data, as-sold scope, contractual terms, win/loss history | None in Phase 1 |
| **Fiori** | Read + Write | COTD status, OPS/SO codes, delivery tracking, scenario planning data | Update COTD, link OPS/SO codes, confirm delivery milestones |
| **RelCare** | Read + Write | Asset condition data, alarm history, condition assessments, DGA and PD readings | Condition assessment submission (via guided experience) |
| **OneIB** | Read + Write | Install base records, asset specs, commissioning data, nameplate data, asset register | Asset register updates (via guided experience) |

### 7.1 Integration Constraints and Open Questions

- **Fiori scenario planning** currently requires Excel export — must be replicated in-platform or Ops Manager still needs Fiori for capacity modelling. **Design risk.**
- **Salesforce write-back deferred** — Sales Managers must manually reconcile offers back to Salesforce in Phase 1.
- **OneIB record completeness varies by LSU** — gaps must be surfaced and flagged, not hidden.
- **RelCare alarm data latency** — confirm near-real-time vs batch with RelCare team. Impacts Ops Manager and Reliability Engineer views significantly.

---

## 8. Feature Requirements

Priority tags: **P0** = must-have for Phase 1 launch · **P1** = iterate post-launch

### 8.1 Job 01 — Find the Contextual Information

**Role assignment and personalised homepage (P0)**
- System reads role from identity provider on first login; correct role view assigned automatically
- Homepage renders correct KPI strip, attention list filters, and guided experience shortcuts without user setup
- Multi-role users: admin assigns primary role; secondary role accessible via role switcher in top nav

**Global search (P0)**
- Queries all five connected systems simultaneously
- Results grouped by type: contracts · assets · cases · orders · contacts · documents
- Respects user permission scope
- Selecting a result opens the detail view

**AI data retrieval (P0)**
- Natural language questions answered against any data object within user's permission scope
- Responses include source system and data timestamp
- Clear messaging if a queried system hasn't completed integration

### 8.2 Job 02 — Know What Needs Attention

**Attention list — rule-based flag generation (P0)**
- Evaluates all contracts/orders on configurable schedule (minimum every 30 minutes)
- **Phase 1 rule library:**
  - Milestone due within 48 hours with no invoice raised
  - Variation order not raised before scheduled site visit
  - Parts with lead time exceeding time to field visit
  - FSE certification expiring within 60 days
  - HSE item open beyond 18 days
  - COTD date inconsistency between Fiori and SAP
  - Contract with no PM assigned for more than 5 days
- Flags labelled with category (Blocker · Margin risk · Site & access · Invoice trigger) and severity (Critical · At risk)
- Each flag: title + one-paragraph explanation of stakes + primary action button

**Attention list — filtering and sorting (P0)**
- Simultaneous filter by priority and category
- Default sort: severity → date relevance
- Users can dismiss flags; dismissed flags logged with timestamp and accessible in "Dismissed" view

**Portfolio KPI strip (P0)**
- Current value, trend vs last period, 6-week sparkline
- Values update every sync cycle
- Clicking a KPI card opens breakdown detail view

**Custom widgets (P1)**
- Add custom widgets from widget library (role-scoped pre-built widgets)
- Drag-and-drop rearrangement
- Star icon on each widget opens AI conversation pre-seeded with widget's data context

### 8.3 Job 03 — Know Who Owns What

**Case and order ownership (P0)**
- Named owner field visible to all users with access to the object
- Unowned objects surface in attention list as priority flag
- Ownership history logged (who owned, when assigned)

**Handoff completeness scoring (P0)**
- Completeness score calculated on transfer (sales → PM, or any role → another)
- Score and missing fields visible to sender and receiver
- Receiving role cannot mark handoff as accepted until score reaches configurable threshold (default: 80%)

**Variation order and change order tracking (P0)**
- All VOs/COs associated with a contract visible in contract detail view
- Status shown: not raised · drafted · sent · signed · declined
- Attention list surfaces change orders where work commenced before sign-off received

### 8.4 Job 04 — Move Work Forward

**In-platform actions (P0)**
- Action buttons in attention list and detail views connect directly to back-end system; execute without navigating away
- **Phase 1 actions:** raise PO (SAP) · trigger milestone invoice (SAP) · update COTD (Fiori) · assign PM to case · queue invoice for future date · submit condition assessment (RelCare) · flag variation order for sign-off
- All actions logged: timestamp · acting user · source flag

**Guided experiences (P0)**
See Section 5.5 for full step-by-step flows.

**Document generation (P0)**
- SLA Offer Builder produces formal offer document (Word format, downloadable)
- AI conversation layer generates draft documents from session data (emails, handover notes, approval requests)
- Generated documents stored in the linked conversation

---

## 9. Key User Flows

### 9.1 First Login and Role Assignment

1. User authenticates via Hitachi Energy SSO
2. System reads role from identity provider
3. **If unambiguous:** user lands directly on role homepage — no setup
4. **If ambiguous/missing:** role selection screen shown; selection logged and escalated to admin
5. First-login overlay explains three zones (KPI strip · attention list · conversation panel); dismissible, non-repeating

### 9.2 Acting on an Attention List Flag

1. User scans attention list on homepage load (sorted by severity)
2. Clicks contract/order name → entry expands
3. Expanded entry shows 2–5 flags with explanations and action buttons
4. User clicks primary action (e.g. "Raise PO today")
5. System confirms action details → user confirms
6. Action executes in back-end (SAP PO raised)
7. Flag marked resolved → moves to "Resolved today" section
8. **On failure:** inline error with explanation + fallback link to source system

### 9.3 Building an SLA Offer (Sales Manager)

1. Sales Manager opens new conversation or selects "Build SLA offer" from guided experience shortcuts
2. Guided experience launches in main content area; left panel remains visible
3. Progresses through 8 steps (see Section 5.5); AI available at each step for questions
4. On completion: offer document generated + conversation record created
5. Four action buttons: generate offer doc · draft customer email · request pricing approval · write PM handover note
6. PM receives HMAX notification with link to case

### 9.4 Starting a Conversation from a KPI Widget

1. User clicks star icon on KPI card (e.g. "Contracts at risk: 14")
2. New conversation opens in left panel, pre-seeded with KPI data context
3. AI summarises what is driving the KPI and surfaces top 3 contributing items
4. User asks follow-up in natural language
5. User can initiate actions from conversation (e.g. "Raise this as a flag for Priya K.")
6. Conversation saved automatically with system-generated name

---

## 10. Non-Functional Requirements

| Requirement | Specification |
|-------------|---------------|
| **Homepage load** | KPI strip + first 10 attention items within 3 seconds on standard enterprise network |
| **AI response time** | First token within 2 seconds; full data query response within 8 seconds |
| **Action execution** | In-platform actions complete or return error within 10 seconds |
| **Data freshness** | Max 30-minute sync cycle; data timestamp visible on all non-real-time surfaces |
| **Availability** | 99.5% uptime during business hours; maintenance windows outside 06:00–22:00 local |
| **Authentication** | SSO via Hitachi Energy IdP · MFA enforced · session timeout after 8 hours inactivity |
| **Data access** | RBAC inherited from source systems · AI cannot surface unauthorised data · 12-month audit log |
| **Accessibility** | WCAG 2.1 AA for all Phase 1 features |
| **Browser support** | Chrome (latest 2 versions) primary; Firefox + Edge supported |
| **Localisation** | English only Phase 1; architecture must support Italian, Dutch, French for Phase 2 |

---

## 11. Open Questions

Must be resolved before or during design sprint.

| # | Question | Why It Matters | Owner |
|---|----------|----------------|-------|
| 1 | What is RelCare alarm data latency — near-real-time or batch? | If batch, Ops Manager and Reliability Engineer views need data freshness warnings in the design | Andrejus Bojevas / RelCare team |
| 2 | Can Fiori scenario planning calculations be replicated in-platform? | If not, Ops Manager still needs Fiori for capacity modelling | Omar Villalobos / Fiori integration lead |
| 3 | Salesforce → HMAX data sync: push (event-driven) or pull (scheduled)? | Push = real-time pipeline for Sales Manager; pull = up to 30-minute latency | Luiz Cheim / Salesforce team |
| 4 | How are multi-role users handled? | Self-service role switcher = auth risk; admin-only = onboarding burden | Product team — decide before sprint |
| 5 | AI model and hosting arrangement — Hitachi Energy infrastructure or third-party cloud? | Impacts data residency compliance for customer data in SLA builder and asset intelligence | Stephen Davis / IT / Legal |
| 6 | Who is the system administrator for role assignment and permissions? | Without a named admin owner, role errors won't be corrected promptly | To be assigned before launch |
| 7 | SLA offer document: Word, PDF, or both? | Affects document generation library and whether output is editable post-generation | Product team |
| 8 | Exact Phase 1 pilot headcount by role across NAM and Netherlands? | Affects infrastructure sizing, support load, baseline metric calculations | Renato Milanese / Stephen Davis |

---

## 12. Out of Scope — Phase 1

Inclusion of any of the following requires a formal change to this PRD and product owner approval.

### Roles
- Field Engineer / Field Service Technician view
- Diagnostics Specialist view
- Control Room / Ops Lead view
- Customer-facing portal (not in scope for any phase under this PRD)

### System Integrations
- FSM (Field Service Management) — referenced in mobilisation planner but not confirmed for Phase 1; staffing step may require manual entry
- Salesforce write-back
- External data sources (weather, shipping, commodity prices)

### Platform and Features
- Mobile application
- Multi-language support
- Customer-visible reporting
- Predictive analytics / AI recommendations beyond rule-based flags
- SSO for non-Hitachi Energy users
- Custom report builder

---

## Appendix — Reference Material

### Stakeholder Interviews
26 interviews conducted across NAM, Italy, Netherlands, France, India, Singapore, Qatar, and Thailand.

Key contributors:
- **Renato Milanese** (Operations Manager, NAM) — "analog system" framing, unified data view
- **Aurelien Bertinotti** (Product Manager, RelCare, France) — "reliability modelling is the IP" principle
- **Francois Naudé** (Reliability Specialist, Netherlands) — evidence trail and cross-asset pattern requirements
- **Tucker Reed & Michelangelo Simonelli** (Sales Managers, NAM + Italy) — SLA offer builder flow, pipeline data trust
- **Ariana Galloccio & Daniel Koyama** (Project Managers, Italy + NAM) — PM attention list, portfolio health score
- **Omar Villalobos** (Global Head of Digital Service Operations, NAM) — Fiori scenario planning constraint, FSE utilisation view

### Pilot LSUs
Phase 1 pilots in two Local Service Units: **North America (NAM)** and **Netherlands**. Selected based on stakeholder interview depth and system integration maturity. Both have active SAP, Salesforce, and RelCare deployments.

### Related Documents
- HMAX Energy Design Interview Plan v2 — August 2026
- HMAX Energy PRD v4.0 — August 2026
- Persona cards: Sales (01), Operations (02), PM (03) — Method / GlobalLogic
- Stakeholder interview synthesis — 26 interviews, August 2026
