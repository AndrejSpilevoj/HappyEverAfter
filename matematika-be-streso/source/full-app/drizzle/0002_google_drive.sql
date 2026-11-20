CREATE TABLE app_settings (key text PRIMARY KEY NOT NULL, value text NOT NULL);
CREATE TABLE oauth_states (hash text PRIMARY KEY NOT NULL, verifier text NOT NULL, nonce text NOT NULL, expires integer NOT NULL);
CREATE TABLE teacher_sessions (hash text PRIMARY KEY NOT NULL, email text NOT NULL, expires integer NOT NULL);
CREATE TABLE drive_objects (key text PRIMARY KEY NOT NULL, drive_id text NOT NULL);
CREATE INDEX oauth_expiry ON oauth_states(expires);
CREATE INDEX teacher_session_expiry ON teacher_sessions(expires);
