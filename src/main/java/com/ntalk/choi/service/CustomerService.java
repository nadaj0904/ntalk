package com.ntalk.choi.service;

import com.ntalk.choi.domain.CustomerDTO;
import com.ntalk.choi.domain.CustomerPageRequest;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * 고객 데이터 관리 서비스 인터페이스
 */
public interface CustomerService {

    /**
     * 고객 목록 페이징 조회
     */
    List<CustomerDTO> getCustomerList(CustomerPageRequest req);

    /**
     * 고객 총 건수 조회
     */
    int getCustomerCount(CustomerPageRequest req);

    /**
     * 고객 단건 조회
     */
    CustomerDTO getCustomerById(int customerId);

    /**
     * 고객 등록
     */
    void addCustomer(CustomerDTO customer);

    /**
     * 고객 정보 수정
     */
    void updateCustomer(CustomerDTO customer);

    /**
     * 고객 삭제 (소프트 삭제)
     */
    void deleteCustomer(int customerId, String deletedId);

    /**
     * 선택 삭제 (다건)
     */
    void deleteCustomers(List<Integer> customerIds, String deletedId);

    /**
     * 설계사 목록 조회 (필터 드롭다운용)
     */
    List<CustomerDTO> getPlannerList();

    /**
     * 엑셀 파일 파싱 및 프리뷰 데이터 반환
     * @param inputStream 엑셀 파일 InputStream
     * @return 파싱 결과 (정상 데이터 + 오류 데이터 분리)
     */
    Map<String, Object> parseExcelPreview(InputStream inputStream);

    /**
     * 엑셀 파싱 결과를 실제 DB에 등록 (덮어쓰기 정책)
     * @param customers 검증 완료된 고객 리스트
     * @param createdId 등록 수행자 ID
     * @return 등록 건수
     */
    int importCustomers(List<CustomerDTO> customers, String createdId);
}
