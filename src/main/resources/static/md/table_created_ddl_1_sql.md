INSERT INTO tb_code_group (code_group_cd, code_group_nm)
VALUES
('INS_COMPANY_TYPE', '보험사 유형'),
('MARKETING_NEEDS_TYPE', '마케팅 자료 유형'),
('INS_COMPANY', '보험사 코드');


INSERT INTO tb_code (code_group_cd, code_cd, code_nm, sort_order)
VALUES
('INS_COMPANY_TYPE', 'L00', '생명보험', 1),
('INS_COMPANY_TYPE', 'N00', '손해보험', 2);



INSERT INTO tb_code (code_group_cd, code_cd, code_nm, sort_order)
VALUES
('MARKETING_NEEDS_TYPE','01','라이프 시나리오형',1),
('MARKETING_NEEDS_TYPE','02','위기 리스크 암시형',2),
('MARKETING_NEEDS_TYPE','03','인포그래픽 일러스트형',3),
('MARKETING_NEEDS_TYPE','04','대비 구조형',4),
('MARKETING_NEEDS_TYPE','05','브로셔 안전 스타일',5),
('MARKETING_NEEDS_TYPE','06','연령 타깃 특화 스타일',6);

INSERT INTO tb_code
(code_group_cd, code_cd, code_nm, sort_order, use_yn)
VALUES
('INS_COMPANY','L01','한화생명',1,'Y'),
('INS_COMPANY','L02','ABL생명',2,'Y'),
('INS_COMPANY','L03','삼성생명',3,'Y'),
('INS_COMPANY','L04','흥국생명',4,'Y'),
('INS_COMPANY','L05','교보생명',5,'Y'),
('INS_COMPANY','L11','신한라이프',6,'Y'),
('INS_COMPANY','L17','푸본현대생명',7,'Y'),
('INS_COMPANY','L18','KB생명',8,'Y'),
('INS_COMPANY','L31','iM라이프',9,'Y'),
('INS_COMPANY','L33','KDB생명',10,'Y'),
('INS_COMPANY','L34','미래에셋생명',11,'Y'),
('INS_COMPANY','L41','IBK연금보험',12,'Y'),
('INS_COMPANY','L42','NH농협생명',13,'Y'),
('INS_COMPANY','L43','교보라이프플래닛',14,'Y'),
('INS_COMPANY','L51','라이나생명',15,'Y'),
('INS_COMPANY','L52','AIA생명',16,'Y'),
('INS_COMPANY','L61','KB라이프생명',17,'Y'),
('INS_COMPANY','L62','오렌지라이프',18,'Y'),
('INS_COMPANY','L63','하나생명',19,'Y'),
('INS_COMPANY','L71','DB생명',20,'Y'),
('INS_COMPANY','L72','메트라이프생명',21,'Y'),
('INS_COMPANY','L74','동양생명',22,'Y'),
('INS_COMPANY','L76','PCA생명',23,'Y'),
('INS_COMPANY','L77','처브라이프',24,'Y'),
('INS_COMPANY','L78','BNP파리바카디프생명',25,'Y'),

('INS_COMPANY','N01','메리츠화재',101,'Y'),
('INS_COMPANY','N02','한화손해보험',102,'Y'),
('INS_COMPANY','N03','롯데손해보험',103,'Y'),
('INS_COMPANY','N04','MG손해보험',104,'Y'),
('INS_COMPANY','N05','흥국화재',105,'Y'),
('INS_COMPANY','N07','제일화재',106,'Y'),
('INS_COMPANY','N08','삼성화재',107,'Y'),
('INS_COMPANY','N09','현대해상',108,'Y'),
('INS_COMPANY','N10','KB손해보험',109,'Y'),
('INS_COMPANY','N11','DB손해보험',110,'Y'),
('INS_COMPANY','N16','AXA다이렉트',111,'Y'),
('INS_COMPANY','N17','하나손해보험',112,'Y'),
('INS_COMPANY','N51','AIG손해보험',113,'Y'),
('INS_COMPANY','N52','ACE손해보험',114,'Y'),
('INS_COMPANY','N71','NH농협손해보험',115,'Y'),
('INS_COMPANY','N72','캐롯손해보험',116,'Y');