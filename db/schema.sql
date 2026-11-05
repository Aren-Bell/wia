-- ==============================================================================
-- Kavi Database Schema (SQLite / Turso libSQL)
-- Base Language: English
-- ==============================================================================

PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------------------------
-- 1. Users & NextAuth Authentication
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    email_verified INTEGER,
    image TEXT,
    bio TEXT,
    role TEXT NOT NULL DEFAULT 'USER' CHECK(role IN ('USER', 'GOVERNMENT', 'INTERNAL')),
    agency_name TEXT,
    jurisdiction_province TEXT,
    post_count INTEGER NOT NULL DEFAULT 0,
    follower_count INTEGER NOT NULL DEFAULT 0,
    following_count INTEGER NOT NULL DEFAULT 0,
    is_banned INTEGER NOT NULL DEFAULT 0,
    warning_count INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires INTEGER NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- ------------------------------------------------------------------------------
-- 2. Taxonomy: Macro Topics & Micro User Tags
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    is_trending INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at INTEGER NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. Posts (Public Issues)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    images TEXT, -- JSON Array of URLs, max 6 images: ["https://..."]
    location_name TEXT NOT NULL,
    province TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'CLOSED')),
    close_type TEXT NOT NULL DEFAULT 'NONE' CHECK(close_type IN ('NONE', 'SOLVED', 'GENERAL')),
    closed_by_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    resolution_comment_id TEXT, -- Forward reference to comments(id), linked after resolution
    quoted_post_id TEXT REFERENCES posts(id) ON DELETE SET NULL,
    upvotes_count INTEGER NOT NULL DEFAULT 0,
    downvotes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    reposts_count INTEGER NOT NULL DEFAULT 0,
    views_count INTEGER NOT NULL DEFAULT 0,
    is_pinned INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    posted_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS post_tags (
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- ------------------------------------------------------------------------------
-- 4. Comments (Discussions & Official Resolution Threads)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id TEXT REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    images TEXT, -- JSON Array of URLs, max 6 images
    upvotes_count INTEGER NOT NULL DEFAULT 0,
    downvotes_count INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. Interactions: Votes, Reposts, Bookmarks & Feed Hiding
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS votes (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK(target_type IN ('POST', 'COMMENT')),
    target_id TEXT NOT NULL,
    vote_type TEXT NOT NULL CHECK(vote_type IN ('UP', 'DOWN')),
    PRIMARY KEY (user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS reposts (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS saved_posts (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS hidden_posts (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, post_id)
);

-- ------------------------------------------------------------------------------
-- 6. Social Graph: Follows, Mutes & Blocks
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS follows (
    follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS muted_users (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    muted_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, muted_user_id)
);

CREATE TABLE IF NOT EXISTS blocked_users (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, blocked_user_id)
);

-- ------------------------------------------------------------------------------
-- 7. Moderation: Reports
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    reporter_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK(target_type IN ('POST', 'COMMENT', 'USER')),
    target_id TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('HOAX', 'HATE_SPEECH', 'SPAM', 'PORNOGRAPHY', 'OTHER')),
    details TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'REVIEWED', 'ACTIONED', 'DISMISSED')),
    created_at INTEGER NOT NULL
);

-- ------------------------------------------------------------------------------
-- 8. Notifications
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK(type IN ('UPVOTE', 'COMMENT', 'REPLY', 'FOLLOW', 'RESOLVED', 'SYSTEM')),
    message TEXT, -- Custom message for SYSTEM warnings or admin notices
    post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
    comment_id TEXT REFERENCES comments(id) ON DELETE CASCADE,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
);

-- ------------------------------------------------------------------------------
-- Indexes for High Performance Feed & Lookup
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_posts_feed_foryou ON posts(status, is_deleted, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_trending_both ON posts(status, is_deleted, upvotes_count DESC, views_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_trending_views ON posts(status, is_deleted, views_count DESC, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_trending_upvotes ON posts(status, is_deleted, upvotes_count DESC, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_province ON posts(province, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, parent_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_votes_target ON votes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at DESC);
