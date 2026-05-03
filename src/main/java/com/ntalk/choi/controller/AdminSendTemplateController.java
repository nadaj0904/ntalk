package com.ntalk.choi.controller;

import com.ntalk.choi.domain.AccountDTO;
import com.ntalk.choi.domain.SendTemplateDTO;
import com.ntalk.choi.domain.SendTemplatePageRequest;
import com.ntalk.choi.domain.common.ApiResponse;
import com.ntalk.choi.service.SendTemplateService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 데이터 관리 - 메세지 관리 컨트롤러
 */
@Controller
public class AdminSendTemplateController {

    private static final Logger log = LoggerFactory.getLogger(AdminSendTemplateController.class);

    private final SendTemplateService sendTemplateService;

    public AdminSendTemplateController(SendTemplateService sendTemplateService) {
        this.sendTemplateService = sendTemplateService;
    }

    // ======================================================
    // HTML View 매핑
    // ======================================================

    /**
     * 메세지 관리 페이지 이동
     */
    @GetMapping("/admin/templateAdmin")
    public String templateAdminPage(HttpSession session, Model model) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        if (user == null) {
            return "redirect:/login";
        }
        model.addAttribute("user", user);
        return "admin/templateAdmin";
    }

    // ======================================================
    // REST API 엔드포인트
    // ======================================================

    /**
     * 메세지 템플릿 목록 조회 (페이징 + 검색)
     */
    @GetMapping("/api/v1/admin/templates/list")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getTemplateList(SendTemplatePageRequest req) {
        List<SendTemplateDTO> list = sendTemplateService.getTemplateList(req);
        int totalCount = sendTemplateService.getTemplateCount(req);

        Map<String, Object> data = new HashMap<>();
        data.put("list", list);
        data.put("totalCount", totalCount);
        data.put("page", req.getPage());
        data.put("size", req.getSize());
        data.put("totalPages", (int) Math.ceil((double) totalCount / req.getSize()));

        return ApiResponse.success("조회 성공", data);
    }

    /**
     * 메세지 템플릿 개별 추가
     */
    @PostMapping("/api/v1/admin/templates")
    @ResponseBody
    public ApiResponse<String> addTemplate(@RequestBody SendTemplateDTO template, HttpSession session) {
        sendTemplateService.addTemplate(template);
        return ApiResponse.success("템플릿이 등록되었습니다.", null);
    }

    /**
     * 메세지 템플릿 정보 수정
     */
    @PutMapping("/api/v1/admin/templates/{templateId}")
    @ResponseBody
    public ApiResponse<String> updateTemplate(@PathVariable int templateId,
                                              @RequestBody SendTemplateDTO template,
                                              HttpSession session) {
        template.setTemplateId(templateId);
        sendTemplateService.updateTemplate(template);
        return ApiResponse.success("템플릿 정보가 수정되었습니다.", null);
    }

    /**
     * 메세지 템플릿 선택 삭제 (다건)
     */
    @DeleteMapping("/api/v1/admin/templates")
    @ResponseBody
    public ApiResponse<String> deleteTemplates(@RequestBody Map<String, List<Integer>> params,
                                               HttpSession session) {
        List<Integer> ids = params.get("ids");
        sendTemplateService.deleteTemplates(ids);
        return ApiResponse.success(ids.size() + "건이 삭제되었습니다.", null);
    }
}
