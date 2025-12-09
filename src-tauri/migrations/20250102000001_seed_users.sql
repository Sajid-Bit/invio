-- Insert sample users
INSERT INTO users (username, full_name, role, status, password, department) VALUES
('rana.alamri', 'رنا العمري', 'محاسب', 'مفعل', 'password123', 'الحسابات'),
('m.q', 'محمد المحيسني', 'موظف', 'مفعل', 'password123', 'الإدارة'),
('sarah.s', 'سارة الشريف', 'مشرف', 'مفعل', 'password123', 'الإدارة');

-- Insert sample activity logs
INSERT INTO user_activity (username, activity) VALUES
('rana.alamri', 'إضافة مصرف جديد (350 ج.س)'),
('sarah.s', 'تعديل موازنة الشهر'),
('m.q', 'تسجيل دخول ناجح');
