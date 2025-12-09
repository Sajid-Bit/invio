-- Sample data for testing (optional - can be removed in production)

-- Add some sample transactions
INSERT INTO transactions (person_name, person_avatar, category, amount, transaction_type, reason, responsible_person, created_at)
VALUES 
  ('رنا العمري', NULL, 'أدوات مكتبية', 350, 'expense', 'شراء أوراق', NULL, datetime('now')),
  ('محمد العظمتي', NULL, 'صيانة', 1200, 'expense', 'إصلاح مكيف', NULL, datetime('now')),
  ('سارة الشريف', NULL, 'كهرباء', 900, 'expense', 'فاتورة شهرية', NULL, datetime('now')),
  ('أحمد الحسن', NULL, 'أدوات مكتبية', 500, 'expense', 'أقلام وملفات', NULL, datetime('now', '-1 day')),
  ('فاطمة محمود', NULL, 'رواتب', 5000, 'expense', 'راتب شهر أكتوبر', 'إدارة الموارد', datetime('now', '-2 days'));
