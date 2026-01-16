-- =====================================================
-- Zentrais Reconciled Schema
-- Merging existing Prisma schema with multi-schema architecture
-- =====================================================

-- Extensions (global)
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- SCHEMA NAMESPACES
-- =========================
CREATE SCHEMA IF NOT EXISTS core;     -- Core identity & auth
CREATE SCHEMA IF NOT EXISTS dialog;   -- Conversations & messaging (including AI)
CREATE SCHEMA IF NOT EXISTS debate;   -- Structured argumentation & deliberation
CREATE SCHEMA IF NOT EXISTS exchange; -- Marketplace & listings
CREATE SCHEMA IF NOT EXISTS audit;    -- Audit & logging (simplified)

-- =========================
-- ENUMS / TYPES
-- =========================

-- Core types
SET search_path TO core, public;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'org_member_status') THEN
    CREATE TYPE org_member_status AS ENUM ('pending', 'active', 'invited', 'suspended');
  END IF;
END$$;

-- Dialog types (aligned with Prisma)
SET search_path TO dialog, public;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_type') THEN
    CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'AUDIO');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ai_message_role') THEN
    CREATE TYPE ai_message_role AS ENUM ('USER', 'ASSISTANT');
  END IF;

  -- Optional: Keep for structured conversations
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conversation_type') THEN
    CREATE TYPE conversation_type AS ENUM ('direct', 'group', 'channel', 'thread');
  END IF;
END$$;

-- Debate types
SET search_path TO debate, public;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stance_label') THEN
    CREATE TYPE stance_label AS ENUM ('pro', 'con', 'neutral', 'question');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote_type') THEN
    CREATE TYPE vote_type AS ENUM ('up', 'down', 'agree', 'disagree', 'insightful', 'constructive');
  END IF;
END$$;

-- Exchange types
SET search_path TO exchange, public;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
    CREATE TYPE listing_status AS ENUM (
      'draft', 
      'active', 
      'pending', 
      'sold', 
      'archived', 
      'removed', 
      'flagged'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_status') THEN
    CREATE TYPE report_status AS ENUM ('pending', 'under_review', 'resolved', 'dismissed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_reason') THEN
    CREATE TYPE report_reason AS ENUM (
      'prohibited_item',
      'fraudulent',
      'inappropriate_content',
      'spam',
      'harassment',
      'counterfeit',
      'other'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'flag_type') THEN
    CREATE TYPE flag_type AS ENUM (
      'ai_content_violation',
      'pricing_anomaly',
      'duplicate_listing',
      'suspicious_activity',
      'automated_system_flag'
    );
  END IF;
END$$;

-- =========================
-- CORE SCHEMA - Identity, Auth, Organizations
-- =========================
SET search_path TO core, public;

-- Organizations
CREATE TABLE IF NOT EXISTS orgs (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        TEXT NOT NULL UNIQUE,
  handle      citext UNIQUE,
  metadata    jsonb,
  created_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users (aligned with Prisma schema)
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_default_id  TEXT REFERENCES orgs(id) ON DELETE SET NULL,
  username        TEXT NOT NULL UNIQUE,
  email           TEXT NOT NULL UNIQUE,
  email_hash      TEXT NOT NULL UNIQUE,
  email_verified  BOOLEAN NOT NULL DEFAULT false,
  display_name    TEXT,
  avatar_url      TEXT,
  password        TEXT NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  deleted_at      TIMESTAMP(3),
  created_at      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User PII (aligned with Prisma schema)
CREATE TABLE IF NOT EXISTS user_pii (
  user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  phone      TEXT,
  legal_name TEXT,
  address    TEXT,
  deleted_at TIMESTAMP(3)
);

-- Org members
CREATE TABLE IF NOT EXISTS org_members (
  org_id     TEXT NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('owner','admin','member','guest')),
  status     org_member_status NOT NULL DEFAULT 'pending',
  joined_at  TIMESTAMP(3),
  deleted_at TIMESTAMP(3),
  PRIMARY KEY (org_id, user_id),
  CONSTRAINT org_members_active_must_have_joined_at
    CHECK (status != 'active' OR joined_at IS NOT NULL)
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP(3),
  expires_at   TIMESTAMP(3) NOT NULL,
  refresh_jti  TEXT,
  ip_addr      inet,
  user_agent   TEXT,
  revoked_at   TIMESTAMP(3),
  deleted_at   TIMESTAMP(3)
);

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_users_org_default ON users(org_default_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_org_members_user ON org_members(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_org_members_org_status ON org_members(org_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at) WHERE revoked_at IS NULL;

-- =========================
-- DIALOG SCHEMA - Messages & AI Conversations
-- =========================
SET search_path TO dialog, public;

-- Direct Messages (P2P messaging - from Prisma schema)
CREATE TABLE IF NOT EXISTS messages (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sender_id  TEXT NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
  receiver_id TEXT NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
  content    TEXT,
  type       message_type NOT NULL DEFAULT 'TEXT',
  media_url  TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AI Threads (from Prisma schema)
CREATE TABLE IF NOT EXISTS ai_threads (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id             TEXT NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
  title               TEXT,
  langgraph_thread_id TEXT NOT NULL UNIQUE,
  created_at          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AI Messages (from Prisma schema with emotion scoring)
CREATE TABLE IF NOT EXISTS ai_messages (
  id                 TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  thread_id          TEXT NOT NULL REFERENCES ai_threads(id) ON DELETE CASCADE,
  role               ai_message_role NOT NULL,
  content            TEXT NOT NULL,
  emotion_score      INTEGER,
  emotion_label      TEXT,
  emotion_reasoning  TEXT,
  created_at         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Structured Conversations (for group/channel features)
CREATE TABLE IF NOT EXISTS conversations (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id      TEXT REFERENCES core.orgs(id) ON DELETE CASCADE,
  created_by  TEXT NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
  title       TEXT,
  description TEXT,
  type        conversation_type NOT NULL DEFAULT 'group',
  visibility  TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('public','org','private')),
  metadata    jsonb,
  deleted_at  TIMESTAMP(3),
  created_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Conversation participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  role            TEXT CHECK (role IN ('owner','moderator','participant','observer')),
  joined_at       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_read_at    TIMESTAMP(3),
  muted           BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMP(3),
  PRIMARY KEY (conversation_id, user_id)
);

-- Dialog indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_threads_langgraph ON ai_threads(langgraph_thread_id);
CREATE INDEX IF NOT EXISTS idx_ai_threads_user_updated ON ai_threads(user_id, updated_at);

CREATE INDEX IF NOT EXISTS idx_ai_messages_thread_created ON ai_messages(thread_id, created_at);

CREATE INDEX IF NOT EXISTS idx_conversations_org_deleted ON conversations(org_id, deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conv ON conversation_participants(conversation_id) WHERE deleted_at IS NULL;

-- =========================
-- DEBATE SCHEMA - Structured Argumentation
-- =========================
SET search_path TO debate, public;

-- Topics (debate subjects)
CREATE TABLE IF NOT EXISTS topics (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id      TEXT NOT NULL REFERENCES core.orgs(id) ON DELETE CASCADE,
  created_by  TEXT NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
  title       TEXT NOT NULL,
  description TEXT,
  context     TEXT,
  visibility  TEXT NOT NULL DEFAULT 'org' CHECK (visibility IN ('public','org','private')),
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','closed','archived')),
  metadata    jsonb,
  deleted_at  TIMESTAMP(3),
  created_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Stances (positions on topics)
CREATE TABLE IF NOT EXISTS stances (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  topic_id   TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  org_id     TEXT NOT NULL REFERENCES core.orgs(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  label      stance_label NOT NULL,
  title      TEXT NOT NULL,
  summary    TEXT,
  details    TEXT,
  weight     DOUBLE PRECISION,
  evidence   jsonb,
  deleted_at TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Arguments (supporting or challenging stances)
CREATE TABLE IF NOT EXISTS arguments (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  stance_id   TEXT NOT NULL REFERENCES stances(id) ON DELETE CASCADE,
  org_id      TEXT NOT NULL REFERENCES core.orgs(id) ON DELETE CASCADE,
  author_id   TEXT NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  parent_id   TEXT REFERENCES arguments(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('support', 'refute', 'clarify', 'evidence')),
  body        TEXT NOT NULL,
  sources     jsonb,
  deleted_at  TIMESTAMP(3),
  created_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Votes (on stances and arguments)
CREATE TABLE IF NOT EXISTS votes (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id      TEXT NOT NULL REFERENCES core.orgs(id) ON DELETE CASCADE,
  voter_id    TEXT NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  stance_id   TEXT REFERENCES stances(id) ON DELETE CASCADE,
  argument_id TEXT REFERENCES arguments(id) ON DELETE CASCADE,
  kind        vote_type NOT NULL,
  deleted_at  TIMESTAMP(3),
  created_at  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT votes_target_chk CHECK (
    (stance_id IS NOT NULL AND argument_id IS NULL)
    OR
    (stance_id IS NULL AND argument_id IS NOT NULL)
  ),
  UNIQUE(voter_id, stance_id, kind),
  UNIQUE(voter_id, argument_id, kind)
);

-- Debate indexes
CREATE INDEX IF NOT EXISTS idx_topics_org_deleted ON topics(org_id, deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_topics_created_by ON topics(created_by) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_topics_status ON topics(org_id, status) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_stances_org_deleted ON stances(org_id, deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_stances_topic ON stances(topic_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_stances_user ON stances(user_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_arguments_stance ON arguments(stance_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_arguments_author ON arguments(author_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_votes_org_deleted ON votes(org_id, deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_votes_voter ON votes(voter_id) WHERE deleted_at IS NULL;

-- Debate triggers
CREATE OR REPLACE FUNCTION enforce_stance_org_matches_topic()
RETURNS trigger AS $$
DECLARE
  topic_org TEXT;
BEGIN
  SELECT org_id INTO topic_org FROM debate.topics WHERE id = NEW.topic_id;
  IF topic_org IS NULL THEN
    RAISE EXCEPTION 'Topic % does not exist', NEW.topic_id;
  END IF;
  IF NEW.org_id <> topic_org THEN
    RAISE EXCEPTION 'Stance org_id % must match Topic org_id %', NEW.org_id, topic_org;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_stances_org_match ON stances;
CREATE TRIGGER trg_stances_org_match
BEFORE INSERT OR UPDATE ON stances
FOR EACH ROW EXECUTE FUNCTION enforce_stance_org_matches_topic();

CREATE OR REPLACE FUNCTION enforce_argument_org_matches_stance()
RETURNS trigger AS $$
DECLARE
  stance_org TEXT;
BEGIN
  SELECT org_id INTO stance_org FROM debate.stances WHERE id = NEW.stance_id;
  IF stance_org IS NULL THEN
    RAISE EXCEPTION 'Stance % does not exist', NEW.stance_id;
  END IF;
  IF NEW.org_id <> stance_org THEN
    RAISE EXCEPTION 'Argument org_id % must match Stance org_id %', NEW.org_id, stance_org;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_arguments_org_match ON arguments;
CREATE TRIGGER trg_arguments_org_match
BEFORE INSERT OR UPDATE ON arguments
FOR EACH ROW EXECUTE FUNCTION enforce_argument_org_matches_stance();

-- =========================
-- EXCHANGE SCHEMA - Marketplace & Commerce (MVP Scope)
-- =========================
SET search_path TO exchange, public;

-- User Profiles (marketplace-specific profile data)
CREATE TABLE IF NOT EXISTS profiles (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id           TEXT NOT NULL UNIQUE REFERENCES core.users(id) ON DELETE CASCADE,
  org_id            TEXT NOT NULL REFERENCES core.orgs(id) ON DELETE CASCADE,
  bio               TEXT,
  location          TEXT,
  verification_level TEXT DEFAULT 'none' CHECK (verification_level IN ('none', 'email', 'phone', 'id', 'full')),
  rating_avg        DECIMAL(3,2) DEFAULT 0.00 CHECK (rating_avg >= 0 AND rating_avg <= 5.00),
  rating_count      INTEGER DEFAULT 0 CHECK (rating_count >= 0),
  listings_count    INTEGER DEFAULT 0 CHECK (listings_count >= 0),
  sales_count       INTEGER DEFAULT 0 CHECK (sales_count >= 0),
  preferences       jsonb DEFAULT '{}',
  metadata          jsonb DEFAULT '{}',
  created_at        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Listings
CREATE TABLE IF NOT EXISTS listings (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id           TEXT NOT NULL REFERENCES core.orgs(id) ON DELETE CASCADE,
  seller_user_id   TEXT NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
  title            TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  description      TEXT NOT NULL CHECK (char_length(description) >= 10),
  category         TEXT NOT NULL,
  subcategory      TEXT,
  condition        TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor', 'for_parts')),
  price_cents      INTEGER NOT NULL CHECK (price_cents > 0),
  currency         TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'CAD', 'AUD')),
  quantity         INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  status           listing_status NOT NULL DEFAULT 'draft',
  images           jsonb DEFAULT '[]',
  location         TEXT,
  shipping_options jsonb DEFAULT '[]',
  tags             TEXT[],
  view_count       INTEGER DEFAULT 0 CHECK (view_count >= 0),
  save_count       INTEGER DEFAULT 0 CHECK (save_count >= 0),
  metadata         jsonb DEFAULT '{}',
  deleted_at       TIMESTAMP(3),
  created_at       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Saved Listings
CREATE TABLE IF NOT EXISTS saved_listings (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    TEXT NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  notes      TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, listing_id)
);

-- Listing Reports
CREATE TABLE IF NOT EXISTS listing_reports (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  listing_id       TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reporter_id      TEXT NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  reason           report_reason NOT NULL,
  description      TEXT NOT NULL CHECK (char_length(description) >= 10),
  status           report_status NOT NULL DEFAULT 'pending',
  reviewed_by      TEXT REFERENCES core.users(id) ON DELETE SET NULL,
  reviewed_at      TIMESTAMP(3),
  resolution_notes TEXT,
  metadata         jsonb DEFAULT '{}',
  created_at       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Listing Flags
CREATE TABLE IF NOT EXISTS listing_flags (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  listing_id       TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  flag_type        flag_type NOT NULL,
  severity         TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description      TEXT NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1.00),
  auto_action      TEXT CHECK (auto_action IN ('none', 'review', 'hide', 'remove')),
  reviewed         BOOLEAN DEFAULT false,
  reviewed_by      TEXT REFERENCES core.users(id) ON DELETE SET NULL,
  reviewed_at      TIMESTAMP(3),
  metadata         jsonb DEFAULT '{}',
  created_at       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User Blocks
CREATE TABLE IF NOT EXISTS user_blocks (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  blocker_id TEXT NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  blocked_id TEXT NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
  reason     TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(blocker_id, blocked_id),
  CONSTRAINT user_blocks_no_self_block CHECK (blocker_id != blocked_id)
);

-- Exchange indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_org ON profiles(org_id);

CREATE INDEX IF NOT EXISTS idx_listings_org_deleted ON listings(org_id, deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_listings_seller_status ON listings(seller_user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status) WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX IF NOT EXISTS idx_listings_category_status ON listings(category, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_listings_created ON listings(created_at DESC) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_listings_unique ON saved_listings(user_id, listing_id);
CREATE INDEX IF NOT EXISTS idx_saved_listings_user ON saved_listings(user_id);

CREATE INDEX IF NOT EXISTS idx_listing_reports_listing ON listing_reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_reports_status ON listing_reports(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listing_flags_listing ON listing_flags(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_flags_reviewed ON listing_flags(reviewed, created_at DESC) WHERE NOT reviewed;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_blocks_unique ON user_blocks(blocker_id, blocked_id);

-- Exchange triggers
CREATE OR REPLACE FUNCTION update_listing_save_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE exchange.listings 
    SET save_count = save_count + 1 
    WHERE id = NEW.listing_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE exchange.listings 
    SET save_count = GREATEST(save_count - 1, 0)
    WHERE id = OLD.listing_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_saved_listings_count ON saved_listings;
CREATE TRIGGER trg_saved_listings_count
AFTER INSERT OR DELETE ON saved_listings
FOR EACH ROW EXECUTE FUNCTION update_listing_save_count();

CREATE OR REPLACE FUNCTION update_profile_listings_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.deleted_at IS NULL THEN
    UPDATE exchange.profiles 
    SET listings_count = listings_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.seller_user_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      UPDATE exchange.profiles 
      SET listings_count = GREATEST(listings_count - 1, 0),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = NEW.seller_user_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_listings_profile_count ON listings;
CREATE TRIGGER trg_listings_profile_count
AFTER INSERT OR UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION update_profile_listings_count();

-- =========================
-- AUDIT SCHEMA - Simplified Logging (MVP)
-- =========================
SET search_path TO audit, public;

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id            BIGSERIAL PRIMARY KEY,
  occurred_at   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actor_user_id TEXT REFERENCES core.users(id) ON DELETE SET NULL,
  org_id        TEXT NOT NULL REFERENCES core.orgs(id) ON DELETE CASCADE,
  schema_name   TEXT NOT NULL,
  table_name    TEXT NOT NULL,
  record_id     TEXT NOT NULL,
  action        TEXT NOT NULL,
  changes       jsonb,
  ip_addr       inet,
  user_agent    TEXT,
  metadata      jsonb DEFAULT '{}'
);

-- Audit indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_occurred ON audit_logs(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record ON audit_logs(schema_name, table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_user_id, occurred_at DESC);

-- Audit helper function
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_id', true)::TEXT;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Audit trigger for listing status changes
CREATE OR REPLACE FUNCTION audit_listing_status_change()
RETURNS trigger AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO audit.audit_logs (
      actor_user_id, org_id, schema_name, table_name, 
      record_id, action, changes
    ) VALUES (
      audit.get_current_user_id(),
      NEW.org_id,
      'exchange',
      'listings',
      NEW.id,
      'status_change',
      jsonb_build_object(
        'status', jsonb_build_object('old', OLD.status, 'new', NEW.status)
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_listing_status ON exchange.listings;
CREATE TRIGGER trg_audit_listing_status
AFTER UPDATE ON exchange.listings
FOR EACH ROW EXECUTE FUNCTION audit_listing_status_change();

-- Reset search path
SET search_path TO public;

-- END