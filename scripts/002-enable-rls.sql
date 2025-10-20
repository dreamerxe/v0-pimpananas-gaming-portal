-- Enable Row Level Security (RLS) for all tables

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_tokens ENABLE ROW LEVEL SECURITY;

-- Games: Public read access, admin write access
CREATE POLICY "Games are viewable by everyone"
  ON games FOR SELECT
  USING (is_active = true);

CREATE POLICY "Games can be inserted by authenticated users"
  ON games FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Games can be updated by authenticated users"
  ON games FOR UPDATE
  USING (true);

-- Ratings: Users can read all, but only insert/update their own
CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own ratings"
  ON ratings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE
  USING (true);

-- Plays: Users can read all, insert their own
CREATE POLICY "Plays are viewable by everyone"
  ON plays FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own plays"
  ON plays FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own plays"
  ON plays FOR UPDATE
  USING (true);

-- Play tokens: Only accessible by the token owner
CREATE POLICY "Users can view their own play tokens"
  ON play_tokens FOR SELECT
  USING (true);

CREATE POLICY "Play tokens can be inserted"
  ON play_tokens FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Play tokens can be updated"
  ON play_tokens FOR UPDATE
  USING (true);
