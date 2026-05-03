-- ============================================================
-- ERD DDL - PostgreSQL
-- 생성일: 2026-03-14
-- 컬럼 표준:
--   생성자ID  → created_id / 생성일   → created_at
--   수정자ID  → updated_id / 수정일   → updated_at
--   삭제자ID  → deleted_id / 삭제일   → deleted_at
-- ============================================================


-- ============================================================
-- 1. TB_CODE_GROUP (코드그룹 정보)
-- ============================================================
CREATE TABLE tb_code_group (
    code_group_cd   VARCHAR(50)     NOT NULL,
    code_group_nm   VARCHAR(200)    NOT NULL,
    use_yn          CHAR(1)         NOT NULL DEFAULT 'Y',
    created_id      VARCHAR(20),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_id      VARCHAR(20),
    updated_at      TIMESTAMP,

    CONSTRAINT pk_code_group PRIMARY KEY (code_group_cd),
    CONSTRAINT ck_code_group_use_yn CHECK (use_yn IN ('Y', 'N'))
);

COMMENT ON TABLE  tb_code_group                IS '코드그룹 정보';
COMMENT ON COLUMN tb_code_group.code_group_cd  IS '코드그룹코드';
COMMENT ON COLUMN tb_code_group.code_group_nm  IS '코드그룹명';
COMMENT ON COLUMN tb_code_group.use_yn         IS '사용여부 (Y/N)';
COMMENT ON COLUMN tb_code_group.created_id     IS '생성자ID';
COMMENT ON COLUMN tb_code_group.created_at     IS '생성일시';
COMMENT ON COLUMN tb_code_group.updated_id     IS '수정자ID';
COMMENT ON COLUMN tb_code_group.updated_at     IS '수정일시';


-- ============================================================
-- 2. TB_CODE (코드 정보)
-- ============================================================
CREATE TABLE tb_code (
    code_id         BIGSERIAL       NOT NULL,
    code_group_cd   VARCHAR(50)     NOT NULL,
    code_cd         VARCHAR(20)     NOT NULL,
    code_nm         VARCHAR(200)    NOT NULL,
    code_desc       VARCHAR(500),
    sort_order      INT             NOT NULL DEFAULT 0,
    use_yn          CHAR(1)         NOT NULL DEFAULT 'Y',
    created_id      VARCHAR(20),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_code          PRIMARY KEY (code_id),
    CONSTRAINT uq_code          UNIQUE (code_group_cd, code_cd),
    CONSTRAINT fk_code_group    FOREIGN KEY (code_group_cd)
                                    REFERENCES tb_code_group (code_group_cd),
    CONSTRAINT ck_code_use_yn   CHECK (use_yn IN ('Y', 'N'))
);

CREATE INDEX idx_code_group_cd ON tb_code (code_group_cd);

COMMENT ON TABLE  tb_code               IS '코드 정보';
COMMENT ON COLUMN tb_code.code_id       IS '코드ID';
COMMENT ON COLUMN tb_code.code_group_cd IS '코드그룹코드 (FK)';
COMMENT ON COLUMN tb_code.code_cd       IS '코드코드';
COMMENT ON COLUMN tb_code.code_nm       IS '코드명';
COMMENT ON COLUMN tb_code.code_desc     IS '코드설명';
COMMENT ON COLUMN tb_code.sort_order    IS '정렬순서 (동일값이면 code_cd ASC로 fallback)';
COMMENT ON COLUMN tb_code.use_yn        IS '사용여부 (Y/N)';
COMMENT ON COLUMN tb_code.created_id    IS '생성자ID';
COMMENT ON COLUMN tb_code.created_at    IS '생성일시';


-- ============================================================
-- 3. TB_REP_PRDT (대표상품 정보)
-- ============================================================
CREATE TABLE tb_rep_prdt (
    rep_prdt_cd     VARCHAR(10)     NOT NULL,
    coal_co_cd      VARCHAR(20)     NOT NULL,
    prdt_gb_cd      VARCHAR(20),
    prdt_knd_cd     VARCHAR(20),
    rep_prdt_nm     VARCHAR(200),
    rep_prdt_desc   VARCHAR(500),
    created_id      VARCHAR(20),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_id      VARCHAR(20),
    updated_at      TIMESTAMP,

    CONSTRAINT pk_rep_prdt PRIMARY KEY (rep_prdt_cd)
);

COMMENT ON TABLE  tb_rep_prdt               IS '대표상품 정보';
COMMENT ON COLUMN tb_rep_prdt.rep_prdt_cd   IS '대표상품코드';
COMMENT ON COLUMN tb_rep_prdt.coal_co_cd    IS '원수사코드';
COMMENT ON COLUMN tb_rep_prdt.prdt_gb_cd    IS '상품구분코드';
COMMENT ON COLUMN tb_rep_prdt.prdt_knd_cd   IS '보험상품유형코드';
COMMENT ON COLUMN tb_rep_prdt.rep_prdt_nm   IS '대표상품명';
COMMENT ON COLUMN tb_rep_prdt.rep_prdt_desc IS '대표상품설명';
COMMENT ON COLUMN tb_rep_prdt.created_id    IS '생성자ID';
COMMENT ON COLUMN tb_rep_prdt.created_at    IS '생성일시';
COMMENT ON COLUMN tb_rep_prdt.updated_id    IS '수정자ID';
COMMENT ON COLUMN tb_rep_prdt.updated_at    IS '수정일시';


-- ============================================================
-- 4. TB_PRODUCT (상품 정보)
-- ============================================================
CREATE TABLE tb_product (
    prdt_cd         VARCHAR(10)     NOT NULL,
    rep_prdt_cd     VARCHAR(10)     NOT NULL,
    coal_co_cd      VARCHAR(20)     NOT NULL,
    prdt_nm         VARCHAR(200),
    prdt_desc       VARCHAR(500),
    sale_start_date DATE,
    sale_end_date   DATE,
    order_use_yn    CHAR(1)         DEFAULT 'Y',
    created_id      VARCHAR(20),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_id      VARCHAR(20),
    updated_at      TIMESTAMP,

    CONSTRAINT pk_product           PRIMARY KEY (prdt_cd),
    CONSTRAINT fk_product_rep_prdt  FOREIGN KEY (rep_prdt_cd)
                                        REFERENCES tb_rep_prdt (rep_prdt_cd),
    CONSTRAINT ck_product_order_yn  CHECK (order_use_yn IN ('Y', 'N')),
    CONSTRAINT ck_product_sale_date CHECK (
        sale_end_date IS NULL OR sale_start_date IS NULL
        OR sale_end_date >= sale_start_date
    )
);

CREATE INDEX idx_product_rep_prdt_cd ON tb_product (rep_prdt_cd);

COMMENT ON TABLE  tb_product                IS '상품 정보';
COMMENT ON COLUMN tb_product.prdt_cd        IS '상품코드';
COMMENT ON COLUMN tb_product.rep_prdt_cd    IS '대표상품코드 (FK)';
COMMENT ON COLUMN tb_product.coal_co_cd     IS '원수사코드';
COMMENT ON COLUMN tb_product.prdt_nm        IS '상품명';
COMMENT ON COLUMN tb_product.prdt_desc      IS '상품설명';
COMMENT ON COLUMN tb_product.sale_start_date IS '판매시작일자';
COMMENT ON COLUMN tb_product.sale_end_date  IS '판매종료일자';
COMMENT ON COLUMN tb_product.order_use_yn   IS '정렬사용여부 (Y/N)';
COMMENT ON COLUMN tb_product.created_id     IS '생성자ID';
COMMENT ON COLUMN tb_product.created_at     IS '생성일시';
COMMENT ON COLUMN tb_product.updated_id     IS '수정자ID';
COMMENT ON COLUMN tb_product.updated_at     IS '수정일시';


-- ============================================================
-- 5. TB_MARKETING_MATERIAL (마케팅자료 정보)
-- ============================================================
CREATE TABLE tb_marketing_material (
    material_id         BIGSERIAL       NOT NULL,
    prdt_cd             VARCHAR(10)     NOT NULL,
    material_category_id BIGINT,
    material_title      VARCHAR(300),
    material_content    TEXT,
    expose_start_date   DATE,
    expose_end_date     DATE,
    use_yn              CHAR(1)         DEFAULT 'Y',
    created_id          BIGINT,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_marketing_material    PRIMARY KEY (material_id),
    CONSTRAINT fk_material_product      FOREIGN KEY (prdt_cd)
                                            REFERENCES tb_product (prdt_cd),
    CONSTRAINT ck_material_use_yn       CHECK (use_yn IN ('Y', 'N')),
    CONSTRAINT ck_material_expose_date  CHECK (
        expose_end_date IS NULL OR expose_start_date IS NULL
        OR expose_end_date >= expose_start_date
    )
);

CREATE INDEX idx_material_prdt_cd ON tb_marketing_material (prdt_cd);

COMMENT ON TABLE  tb_marketing_material                     IS '마케팅자료 정보';
COMMENT ON COLUMN tb_marketing_material.material_id         IS '마케팅자료ID';
COMMENT ON COLUMN tb_marketing_material.prdt_cd             IS '상품코드 (FK)';
COMMENT ON COLUMN tb_marketing_material.material_category_id IS '자료카테고리ID';
COMMENT ON COLUMN tb_marketing_material.material_title      IS '자료제목';
COMMENT ON COLUMN tb_marketing_material.material_content    IS '자료내용';
COMMENT ON COLUMN tb_marketing_material.expose_start_date   IS '노출시작일자';
COMMENT ON COLUMN tb_marketing_material.expose_end_date     IS '노출종료일자';
COMMENT ON COLUMN tb_marketing_material.use_yn              IS '사용여부 (Y/N)';
COMMENT ON COLUMN tb_marketing_material.created_id          IS '생성자ID';
COMMENT ON COLUMN tb_marketing_material.created_at          IS '생성일시';


-- ============================================================
-- 6. TB_MARKETING_MATERIAL_FILE (마케팅자료 파일 정보)
-- ============================================================
CREATE TABLE tb_marketing_material_file (
    material_file_id    BIGSERIAL       NOT NULL,
    material_id         BIGINT          NOT NULL,
    file_url            VARCHAR(500),
    file_name           VARCHAR(300),
    file_size           BIGINT,
    thumbnail_url       VARCHAR(500),
    sort_order          INT             DEFAULT 0,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_material_file         PRIMARY KEY (material_file_id),
    CONSTRAINT fk_material_file_mat     FOREIGN KEY (material_id)
                                            REFERENCES tb_marketing_material (material_id)
);

CREATE INDEX idx_material_file_material_id ON tb_marketing_material_file (material_id);

COMMENT ON TABLE  tb_marketing_material_file                IS '마케팅자료 파일 정보';
COMMENT ON COLUMN tb_marketing_material_file.material_file_id IS '마케팅자료파일ID';
COMMENT ON COLUMN tb_marketing_material_file.material_id    IS '마케팅자료ID (FK)';
COMMENT ON COLUMN tb_marketing_material_file.file_url       IS '파일URL';
COMMENT ON COLUMN tb_marketing_material_file.file_name      IS '파일명';
COMMENT ON COLUMN tb_marketing_material_file.file_size      IS '파일크기 (bytes)';
COMMENT ON COLUMN tb_marketing_material_file.thumbnail_url  IS '썸네일URL';
COMMENT ON COLUMN tb_marketing_material_file.sort_order     IS '파일정렬순서';
COMMENT ON COLUMN tb_marketing_material_file.created_at     IS '등록일시';
