package com.ntalk.choi.repository;

import com.ntalk.choi.domain.CustomerDTO;
import com.ntalk.choi.domain.CustomerPageRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * TB_NTALK_USER_CUSTOMER 테이블 접근을 위한 MyBatis 매퍼 인터페이스
 */
@Mapper
public interface CustomerMapper {

    /**
     * 페이징 + 검색 조건으로 고객 목록을 조회한다.
     * @param req 페이징/검색 조건
     * @return 고객 목록 (설계사명 JOIN 포함)
     */
    List<CustomerDTO> selectCustomerList(CustomerPageRequest req);

    /**
     * 페이징 + 검색 조건에 해당하는 전체 건수를 조회한다.
     * @param req 페이징/검색 조건
     * @return 총 건수
     */
    int selectCustomerCount(CustomerPageRequest req);

    /**
     * 고객 단건 조회
     * @param customerId 고객 고유번호
     * @return 고객 정보
     */
    CustomerDTO selectCustomerById(@Param("customerId") int customerId);

    /**
     * 고객 등록 (개별 / 엑셀 업로드 건 별)
     * @param customer 고객 정보
     */
    void insertCustomer(CustomerDTO customer);

    /**
     * 고객 정보 수정 (인라인 에디팅)
     * @param customer 수정할 고객 정보
     */
    void updateCustomer(CustomerDTO customer);

    /**
     * 고객 소프트 삭제 (deleted_at 세팅)
     * @param customerId 고객 고유번호
     * @param deletedId 삭제 수행자 ID
     */
    void deleteCustomer(@Param("customerId") int customerId, @Param("deletedId") String deletedId);

    /**
     * 휴대폰 번호로 고객 존재 여부 확인 (엑셀 업로드 중복 체크용)
     * @param mobile 휴대폰 번호
     * @return 존재하는 고객 정보 (없으면 null)
     */
    CustomerDTO selectCustomerByMobile(@Param("mobile") String mobile);

    /**
     * 설계사 목록 조회 (필터 드롭다운용)
     * @return 설계사 ID/이름/사번 목록
     */
    List<CustomerDTO> selectPlannerList();
}
