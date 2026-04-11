package com.ntalk.choi.service;

import com.ntalk.choi.domain.CustomerDTO;
import com.ntalk.choi.domain.CustomerPageRequest;
import com.ntalk.choi.repository.CustomerMapper;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.*;

/**
 * CustomerService 구현체
 */
@Service
public class CustomerServiceImpl implements CustomerService {

    private static final Logger log = LoggerFactory.getLogger(CustomerServiceImpl.class);

    private final CustomerMapper customerMapper;

    public CustomerServiceImpl(CustomerMapper customerMapper) {
        this.customerMapper = customerMapper;
    }

    @Override
    public List<CustomerDTO> getCustomerList(CustomerPageRequest req) {
        log.debug("Fetching customer list - page: {}, size: {}, keyword: {}", req.getPage(), req.getSize(), req.getKeyword());
        List<CustomerDTO> list = customerMapper.selectCustomerList(req);
        log.debug("Found {} customers", list.size());
        return list;
    }

    @Override
    public int getCustomerCount(CustomerPageRequest req) {
        int count = customerMapper.selectCustomerCount(req);
        log.debug("Total customer count: {}", count);
        return count;
    }

    @Override
    public CustomerDTO getCustomerById(int customerId) {
        log.debug("Fetching customer by id: {}", customerId);
        return customerMapper.selectCustomerById(customerId);
    }

    @Override
    @Transactional
    public void addCustomer(CustomerDTO customer) {
        log.debug("Adding new customer: {}", customer.getName());
        customerMapper.insertCustomer(customer);
        log.debug("Customer added successfully");
    }

    @Override
    @Transactional
    public void updateCustomer(CustomerDTO customer) {
        log.debug("Updating customer id: {}", customer.getCustomerId());
        customerMapper.updateCustomer(customer);
        log.debug("Customer updated successfully");
    }

    @Override
    @Transactional
    public void deleteCustomer(int customerId, String deletedId) {
        log.debug("Soft-deleting customer id: {} by {}", customerId, deletedId);
        customerMapper.deleteCustomer(customerId, deletedId);
    }

    @Override
    @Transactional
    public void deleteCustomers(List<Integer> customerIds, String deletedId) {
        log.debug("Bulk soft-deleting {} customers by {}", customerIds.size(), deletedId);
        for (Integer id : customerIds) {
            customerMapper.deleteCustomer(id, deletedId);
        }
        log.debug("Bulk delete completed");
    }

    @Override
    public List<CustomerDTO> getPlannerList() {
        log.debug("Fetching planner list for filter dropdown");
        return customerMapper.selectPlannerList();
    }

    @Override
    public Map<String, Object> parseExcelPreview(InputStream inputStream) {
        log.debug("Starting Excel file parsing for preview...");
        List<CustomerDTO> validList = new ArrayList<>();
        List<Map<String, Object>> errorList = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            int totalRows = sheet.getPhysicalNumberOfRows();
            log.debug("Excel sheet has {} rows (including header)", totalRows);

            // 첫 번째 행은 헤더로 간주 (설계사사번, 고객명, 휴대폰번호)
            for (int i = 1; i < totalRows; i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String plannerCode = getCellStringValue(row.getCell(0));
                String customerName = getCellStringValue(row.getCell(1));
                String mobile = getCellStringValue(row.getCell(2));

                Map<String, Object> errorInfo = new LinkedHashMap<>();
                errorInfo.put("rowNum", i + 1);
                errorInfo.put("plannerCode", plannerCode);
                errorInfo.put("customerName", customerName);
                errorInfo.put("mobile", mobile);

                // 유효성 검사
                List<String> errors = new ArrayList<>();
                if (plannerCode == null || plannerCode.isEmpty()) {
                    errors.add("설계사 사번 누락");
                }
                if (customerName == null || customerName.isEmpty()) {
                    errors.add("고객명 누락");
                }
                if (mobile == null || mobile.isEmpty()) {
                    errors.add("휴대폰 번호 누락");
                }

                if (!errors.isEmpty()) {
                    errorInfo.put("errors", errors);
                    errorList.add(errorInfo);
                    log.debug("Row {} has validation errors: {}", i + 1, errors);
                    continue;
                }

                // 설계사 코드로 planner_id 매핑 (간소화 - 실제로는 DB 조회)
                CustomerDTO dto = new CustomerDTO();
                dto.setName(customerName);
                dto.setMobile(mobile.replaceAll("[^0-9]", "")); // 숫자만 추출
                dto.setPlannerCode(plannerCode);
                dto.setIsActive(true);
                validList.add(dto);
            }
        } catch (Exception e) {
            log.error("Excel parsing failed: ", e);
            throw new RuntimeException("엑셀 파일 파싱 중 오류가 발생했습니다: " + e.getMessage());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("validList", validList);
        result.put("errorList", errorList);
        result.put("validCount", validList.size());
        result.put("errorCount", errorList.size());
        log.debug("Excel parsing complete - valid: {}, errors: {}", validList.size(), errorList.size());
        return result;
    }

    @Override
    @Transactional
    public int importCustomers(List<CustomerDTO> customers, String createdId) {
        log.debug("Importing {} customers with OVERWRITE policy", customers.size());
        int importedCount = 0;

        for (CustomerDTO customer : customers) {
            customer.setCreatedId(createdId);

            // 덮어쓰기 정책: 동일 번호가 있으면 UPDATE, 없으면 INSERT
            CustomerDTO existing = customerMapper.selectCustomerByMobile(customer.getMobile());
            if (existing != null) {
                log.debug("Phone {} already exists (id: {}), overwriting...", customer.getMobile(), existing.getCustomerId());
                customer.setCustomerId(existing.getCustomerId());
                customer.setUpdatedId(createdId);
                customerMapper.updateCustomer(customer);
            } else {
                log.debug("Phone {} is new, inserting...", customer.getMobile());
                customerMapper.insertCustomer(customer);
            }
            importedCount++;
        }

        log.debug("Import completed: {} customers processed", importedCount);
        return importedCount;
    }

    /**
     * 엑셀 셀 값을 문자열로 추출하는 헬퍼 메서드
     */
    private String getCellStringValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                // 숫자형 셀을 문자열로 변환 (전화번호 등)
                double numVal = cell.getNumericCellValue();
                if (numVal == Math.floor(numVal)) {
                    return String.valueOf((long) numVal);
                }
                return String.valueOf(numVal);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }
}
