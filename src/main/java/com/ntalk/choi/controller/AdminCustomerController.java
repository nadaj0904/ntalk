package com.ntalk.choi.controller;

import com.ntalk.choi.domain.AccountDTO;
import com.ntalk.choi.domain.CustomerDTO;
import com.ntalk.choi.domain.CustomerPageRequest;
import com.ntalk.choi.domain.common.ApiResponse;
import com.ntalk.choi.service.CustomerService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** GO AHEAD */

/**
 * 데이터 관리 (설계사/고객 매핑) 컨트롤러
 */
@Controller
public class AdminCustomerController {

    private static final Logger log = LoggerFactory.getLogger(AdminCustomerController.class);

    private final CustomerService customerService;

    public AdminCustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // ======================================================
    // HTML View 매핑
    // ======================================================

    /**
     * 데이터 관리 페이지 이동
     */
    @GetMapping("/admin/custAdmin")
    public String custAdminPage(HttpSession session, Model model) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        if (user == null) {
            log.debug("Unauthenticated access to custAdmin, redirecting to /login");
            return "redirect:/login";
        }
        log.debug("Rendering custAdmin page for user: {}", user.getEmail());
        model.addAttribute("user", user);
        return "admin/custAdmin";
    }

    // ======================================================
    // REST API 엔드포인트
    // ======================================================

    /**
     * 고객 목록 조회 (페이징 + 검색)
     */
    @GetMapping("/api/v1/admin/customers")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getCustomerList(CustomerPageRequest req) {
        log.debug("API: getCustomerList called - page: {}, size: {}, keyword: {}", req.getPage(), req.getSize(), req.getKeyword());

        List<CustomerDTO> list = customerService.getCustomerList(req);
        int totalCount = customerService.getCustomerCount(req);

        Map<String, Object> data = new HashMap<>();
        data.put("list", list);
        data.put("totalCount", totalCount);
        data.put("page", req.getPage());
        data.put("size", req.getSize());
        data.put("totalPages", (int) Math.ceil((double) totalCount / req.getSize()));

        log.debug("API: Returning {} customers out of {} total", list.size(), totalCount);
        return ApiResponse.success("조회 성공", data);
    }

    /**
     * 설계사 목록 조회 (필터 드롭다운용)
     */
    @GetMapping("/api/v1/admin/planners")
    @ResponseBody
    public ApiResponse<List<CustomerDTO>> getPlannerList() {
        log.debug("API: getPlannerList called");
        List<CustomerDTO> planners = customerService.getPlannerList();
        return ApiResponse.success("설계사 목록 조회 성공", planners);
    }

    /**
     * 고객 개별 추가
     */
    @PostMapping("/api/v1/admin/customers")
    @ResponseBody
    public ApiResponse<String> addCustomer(@RequestBody CustomerDTO customer, HttpSession session) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        log.debug("API: addCustomer called by {} - name: {}", user.getEmail(), customer.getName());

        customer.setCreatedId(user.getEmail());
        customerService.addCustomer(customer);
        return ApiResponse.success("고객이 등록되었습니다.", null);
    }

    /**
     * 고객 정보 수정 (인라인 에디팅)
     */
    @PutMapping("/api/v1/admin/customers/{customerId}")
    @ResponseBody
    public ApiResponse<String> updateCustomer(@PathVariable int customerId,
                                               @RequestBody CustomerDTO customer,
                                               HttpSession session) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        log.debug("API: updateCustomer called by {} - customerId: {}", user.getEmail(), customerId);

        customer.setCustomerId(customerId);
        customer.setUpdatedId(user.getEmail());
        customerService.updateCustomer(customer);
        return ApiResponse.success("고객 정보가 수정되었습니다.", null);
    }

    /**
     * 고객 선택 삭제 (다건)
     */
    @DeleteMapping("/api/v1/admin/customers")
    @ResponseBody
    public ApiResponse<String> deleteCustomers(@RequestBody Map<String, List<Integer>> params,
                                                HttpSession session) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        List<Integer> ids = params.get("ids");
        log.debug("API: deleteCustomers called by {} - ids: {}", user.getEmail(), ids);

        customerService.deleteCustomers(ids, user.getEmail());
        return ApiResponse.success(ids.size() + "건이 삭제되었습니다.", null);
    }

    /**
     * 엑셀 파일 업로드 프리뷰
     */
    @PostMapping("/api/v1/admin/customers/upload-preview")
    @ResponseBody
    public ApiResponse<Map<String, Object>> uploadPreview(@RequestParam("file") MultipartFile file) {
        log.debug("API: uploadPreview called - filename: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());

        if (file.isEmpty()) {
            return ApiResponse.error("파일이 비어있습니다.");
        }

        try {
            Map<String, Object> result = customerService.parseExcelPreview(file.getInputStream());
            return ApiResponse.success("엑셀 파싱 완료", result);
        } catch (Exception e) {
            log.error("Excel upload preview failed: ", e);
            return ApiResponse.error("엑셀 파싱 실패: " + e.getMessage());
        }
    }

    /**
     * 엑셀 파싱 결과 최종 등록 (덮어쓰기 정책)
     */
    @PostMapping("/api/v1/admin/customers/import")
    @ResponseBody
    public ApiResponse<Map<String, Object>> importCustomers(@RequestBody List<CustomerDTO> customers,
                                                             HttpSession session) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        log.debug("API: importCustomers called by {} - {} rows", user.getEmail(), customers.size());

        int count = customerService.importCustomers(customers, user.getEmail());
        Map<String, Object> result = new HashMap<>();
        result.put("importedCount", count);
        return ApiResponse.success(count + "건이 등록되었습니다.", result);
    }
}
