DELETE FROM about_user;
DELETE FROM accounts;
DELETE FROM avatars;
DELETE FROM assigned;
DELETE FROM game_codes;
DELETE FROM selfies;
DELETE FROM sessions;
DELETE FROM sqlite_sequence
WHERE name = 'accounts';
DELETE FROM sqlite_sequence
WHERE name = 'game_codes';
DELETE FROM sqlite_sequence
WHERE name = 'sessions';
DELETE FROM sqlite_sequence
WHERE name = 'user_games';
DELETE FROM sqlite_sequence
WHERE name = 'users';
DELETE FROM sqlite_sequence
WHERE name = 'verification_tokens';
DELETE FROM user_games;
DELETE FROM users;
DELETE FROM verification_tokens;
-- If you also want to reset the sequence values, you need to use the following command
-- SQLite does not automatically reset the sequence when you delete all rows, so you need to manually update the sequence if necessary:
UPDATE sqlite_sequence
SET seq = 0
WHERE name = 'accounts';
UPDATE sqlite_sequence
SET seq = 0
WHERE name = 'game_codes';
UPDATE sqlite_sequence
SET seq = 0
WHERE name = 'sessions';
UPDATE sqlite_sequence
SET seq = 0
WHERE name = 'user_games';
UPDATE sqlite_sequence
SET seq = 0
WHERE name = 'users';
UPDATE sqlite_sequence
SET seq = 0
WHERE name = 'verification_tokens';