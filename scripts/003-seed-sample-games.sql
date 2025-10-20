-- Seed sample games for testing
-- Note: In production, game URLs should be properly encrypted

INSERT INTO games (title, description, thumbnail_url, encrypted_game_url, category, is_active)
VALUES
  (
    'Banana Blast',
    'Fast-paced arcade shooter where you blast through waves of enemies!',
    '/placeholder.svg?height=300&width=400',
    'ENCRYPTED_URL_PLACEHOLDER_1',
    'Action',
    true
  ),
  (
    'Crypto Racer',
    'Race through neon-lit tracks in this high-speed racing game.',
    '/placeholder.svg?height=300&width=400',
    'ENCRYPTED_URL_PLACEHOLDER_2',
    'Racing',
    true
  ),
  (
    'Puzzle Paradise',
    'Solve challenging puzzles in this brain-teasing adventure.',
    '/placeholder.svg?height=300&width=400',
    'ENCRYPTED_URL_PLACEHOLDER_3',
    'Puzzle',
    true
  ),
  (
    'Space Defender',
    'Defend your base from alien invaders in this classic space shooter.',
    '/placeholder.svg?height=300&width=400',
    'ENCRYPTED_URL_PLACEHOLDER_4',
    'Action',
    true
  ),
  (
    'Banana Run',
    'Endless runner with banana-themed obstacles and power-ups.',
    '/placeholder.svg?height=300&width=400',
    'ENCRYPTED_URL_PLACEHOLDER_5',
    'Casual',
    true
  ),
  (
    'Neon Breakout',
    'Classic brick-breaking action with a cyberpunk twist.',
    '/placeholder.svg?height=300&width=400',
    'ENCRYPTED_URL_PLACEHOLDER_6',
    'Arcade',
    true
  )
ON CONFLICT DO NOTHING;
