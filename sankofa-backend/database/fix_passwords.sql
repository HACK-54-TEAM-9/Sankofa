-- Fix password hashes for all test users
-- Password for all users: password123
-- Correct bcrypt hash: $2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq

UPDATE users
SET password = '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq'
WHERE email IN (
    'kwame.mensah@example.com',
    'ama.osei@example.com',
    'kofi.asante@example.com',
    'abena.owusu@example.com',
    'yaw.boateng@example.com',
    'akosua.darko@example.com',
    'kwesi.appiah@example.com',
    'efua.adjei@example.com',
    'samuel.nkrumah@example.com',
    'adwoa.mensah@example.com'
);

SELECT 'Updated ' || COUNT(*) || ' user passwords' FROM users
WHERE password = '$2a$12$20/J4Vn8R14oTxRYL5TBvu/HN.L6TdT1bqmY8X9.ID0njyfkQMyNq';
