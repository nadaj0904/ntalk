const { Client } = require('pg');

const client = new Client({
  host: 'ls-5f64aa7ed07442b10117b0598708e167f910fb43.cx0kqa40mod9.ap-northeast-2.rds.amazonaws.com',
  port: 5432,
  user: 'dbmasteruser',
  password: 'database36!!',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

const sql = `
-- DDL
CREATE TABLE IF NOT EXISTS TB_NTALK_USER_ACCOUNT (
    account_id SERIAL PRIMARY KEY,
    admin_id VARCHAR(50),
    admin_pw VARCHAR(255),
    admin_name VARCHAR(100),
    admin_role VARCHAR(50),
    email VARCHAR(100),
    mobile VARCHAR(20),
    password_hash VARCHAR(255),
    role_type VARCHAR(50),
    last_login_at TIMESTAMP,
    created_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_id VARCHAR(50),
    updated_at TIMESTAMP,
    deleted_id VARCHAR(50),
    deleted_at TIMESTAMP
);

ALTER TABLE TB_NTALK_USER_ACCOUNT ADD COLUMN IF NOT EXISTS mobile VARCHAR(20);

CREATE TABLE IF NOT EXISTS EM_TRAN (
    TRAN_PR SERIAL PRIMARY KEY,
    TRAN_PHONE VARCHAR(20),
    TRAN_CALLBACK VARCHAR(20),
    TRAN_STATUS INTEGER,
    TRAN_DATE TIMESTAMP,
    TRAN_TYPE INTEGER,
    TRAN_MSG TEXT
);

CREATE TABLE IF NOT EXISTS TB_NTALK_USER_PLANNER (
    planner_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    planner_code VARCHAR(50),
    company_cd VARCHAR(50),
    branch_name VARCHAR(100),
    email VARCHAR(100),
    mobile VARCHAR(20),
    license_info VARCHAR(255),
    intro TEXT,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS TB_NTALK_USER_CUSTOMER (
    customer_id SERIAL PRIMARY KEY,
    planner_id INTEGER,
    name VARCHAR(100),
    mobile VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_id VARCHAR(50),
    updated_at TIMESTAMP,
    deleted_id VARCHAR(50),
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS TB_NTALK_SEND_TEMPLATE (
    template_id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    content_text TEXT,
    image_url VARCHAR(500),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS TB_NTALK_SEND_QUEUE (
    queue_id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    planner_id INTEGER,
    template_id INTEGER,
    message_text TEXT,
    image_url VARCHAR(500),
    send_type VARCHAR(50),
    scheduled_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS TB_NTALK_CODE (
    code_init VARCHAR(30) NOT NULL,
    code_id VARCHAR(20) NOT NULL,
    client_id INT NOT NULL,
    code_name VARCHAR(150) NOT NULL,
    code_nickname VARCHAR(150),
    print_order INT,
    use_yn BOOLEAN,
    disp_yn BOOLEAN,
    code_description VARCHAR(200),
    created_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_id VARCHAR(100),
    updated_at TIMESTAMP,
    deleted_id VARCHAR(100),
    deleted_at TIMESTAMP,
    PRIMARY KEY (code_init, code_id, client_id)
);

CREATE TABLE IF NOT EXISTS TB_NTALK_CODE_MAP_MANAGEMENT (
    client_id INT NOT NULL,
    mapping_init VARCHAR(30) NOT NULL,
    mapping_group VARCHAR(30) NOT NULL,
    mapping_code VARCHAR(100) NOT NULL,
    mapping_init_name VARCHAR(150),
    mapping_group_name VARCHAR(150),
    mapping_code_name VARCHAR(150) NOT NULL,
    use_yn BOOLEAN,
    disp_yn BOOLEAN,
    print_order INT,
    created_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_id VARCHAR(100),
    updated_at TIMESTAMP,
    deleted_id VARCHAR(100),
    deleted_at TIMESTAMP,
    PRIMARY KEY (client_id, mapping_init, mapping_group, mapping_code)
);

CREATE TABLE IF NOT EXISTS TB_NTALK_CODE_MANAGEMENT (
    code_init VARCHAR(30) NOT NULL,
    client_id INT NOT NULL,
    code_init_name VARCHAR(150) NOT NULL,
    use_yn BOOLEAN,
    created_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_id VARCHAR(100),
    updated_at TIMESTAMP,
    deleted_id VARCHAR(100),
    deleted_at TIMESTAMP,
    PRIMARY KEY (code_init, client_id)
);

-- DML (DELETE first to avoid duplicates if run multiple times)
DELETE FROM TB_NTALK_USER_ACCOUNT WHERE admin_id = 'admin';
DELETE FROM TB_NTALK_USER_PLANNER WHERE planner_code IN ('PLN001', 'PLN002');
DELETE FROM TB_NTALK_USER_CUSTOMER WHERE planner_id IN (1, 2);
DELETE FROM TB_NTALK_SEND_TEMPLATE WHERE title = '가입 축하 메시지';

INSERT INTO TB_NTALK_USER_ACCOUNT (admin_id, admin_pw, admin_name, admin_role, email, password_hash, role_type) 
VALUES ('admin', 'admin123!', '최고관리자', 'SUPER_ADMIN', 'admin@ntalk.com', 'hashed_pw', 'ADMIN');

INSERT INTO TB_NTALK_USER_PLANNER (planner_id, name, planner_code) 
VALUES (1, '김설계', 'PLN001'), (2, '이플래너', 'PLN002')
ON CONFLICT (planner_id) DO NOTHING;

-- Adjust sequence for planner_id
SELECT setval(pg_get_serial_sequence('TB_NTALK_USER_PLANNER', 'planner_id'), coalesce(max(planner_id), 1), max(planner_id) IS NOT null) FROM TB_NTALK_USER_PLANNER;

INSERT INTO TB_NTALK_USER_CUSTOMER (planner_id, name, mobile, is_active, created_id) 
VALUES 
(1, '박고객', '010-1111-2222', true, 'admin'),
(1, '최고객', '010-3333-4444', true, 'admin'),
(2, '정고객', '010-5555-6666', true, 'admin');

INSERT INTO TB_NTALK_SEND_TEMPLATE (title, content_text, category, is_active)
VALUES ('가입 축하 메시지', '고객님의 가입을 진심으로 축하드립니다.', 'WELCOME', true);
`;

async function run() {
  try {
    await client.connect();
    console.log('Connected to DB successfully.');
    await client.query(sql);
    console.log('DDL and DML executed successfully.');
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

run();
