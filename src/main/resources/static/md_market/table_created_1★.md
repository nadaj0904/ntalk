
# table 생성 규칙

## 1. 데이터베이스
postgresql 사용

## 2. 테이블명 규칙

테이블명은 모두 대문자를 사용한다.
테이블명 prefix는 TB_NTALK_ 로 시작하여 시스템 구분 (TB_NTALK_USER_, TB_NTALK_MART_, TB_NTALK_HIST_)
컬럼명은 모두 소문자를 사용한다.
약어 남발 금지 (usr, plnr 등)
seq, no 사용 금지 → _id 사용
YN 컬럼은 boolean 고려

# 날짜 컬럼 참조

## 3. 테이블 생성시 무조건 포함 (날짜 컬럼)

생성자ID	created_id
생성일	created_at
수정자ID	updated_id
수정일	updated_at
삭제자ID	deleted_id
삭제일	deleted_at




<!-- 최종로그인	last_login_at -->
<!-- 승인일	approved_at -->


## 4. 시퀀스 생성 규칙

시퀀스는 모두 대문자를 사용한다.
시퀀스 prefix는 SEQ_ 로 시작하여 시스템 구분 (SEQ_USER_, SEQ_MART_, SEQ_HIST_)


## 5. 인덱스 생성 규칙

인덱스는 모두 대문자를 사용한다.
인덱스 prefix는 IDX_ 로 시작하여 시스템 구분 (IDX_USER_, IDX_MART_, IDX_HIST_)


## 6. 제약조건 생성 규칙

제약조건은 모두 대문자를 사용한다.
제약조건 prefix는 FK_ 로 시작하여 시스템 구분 (FK_USER_, FK_MART_, FK_HIST_)


## 7. 주석 생성 규칙

주석은 모두 한글로 작성한다.
주석 prefix는 -- 로 시작하여 시스템 구분 ( -- USER_, -- MART_, -- HIST_)


