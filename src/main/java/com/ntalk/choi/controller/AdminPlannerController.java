package com.ntalk.choi.controller;

import com.ntalk.choi.domain.AccountDTO;
import com.ntalk.choi.domain.PlannerDTO;
import com.ntalk.choi.domain.PlannerPageRequest;
import com.ntalk.choi.domain.common.ApiResponse;
import com.ntalk.choi.service.PlannerService;
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
 * 데이터 관리 - 플래너 관리 컨트롤러
 */
@Controller
public class AdminPlannerController {

    private static final Logger log = LoggerFactory.getLogger(AdminPlannerController.class);

    private final PlannerService plannerService;

    public AdminPlannerController(PlannerService plannerService) {
        this.plannerService = plannerService;
    }

    // ======================================================
    // HTML View 매핑
    // ======================================================

    /**
     * 플래너 관리 페이지 이동
     */
    @GetMapping("/admin/plannerAdmin")
    public String plannerAdminPage(HttpSession session, Model model) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        if (user == null) {
            return "redirect:/login";
        }
        model.addAttribute("user", user);
        return "admin/plannerAdmin";
    }

    // ======================================================
    // REST API 엔드포인트
    // ======================================================

    /**
     * 플래너 목록 조회 (페이징 + 검색)
     */
    @GetMapping("/api/v1/admin/planners/list")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getPlannerList(PlannerPageRequest req) {
        List<PlannerDTO> list = plannerService.getPlannerList(req);
        int totalCount = plannerService.getPlannerCount(req);

        Map<String, Object> data = new HashMap<>();
        data.put("list", list);
        data.put("totalCount", totalCount);
        data.put("page", req.getPage());
        data.put("size", req.getSize());
        data.put("totalPages", (int) Math.ceil((double) totalCount / req.getSize()));

        return ApiResponse.success("조회 성공", data);
    }

    /**
     * 플래너 개별 추가
     */
    @PostMapping("/api/v1/admin/planners")
    @ResponseBody
    public ApiResponse<String> addPlanner(@RequestBody PlannerDTO planner, HttpSession session) {
        plannerService.addPlanner(planner);
        return ApiResponse.success("플래너가 등록되었습니다.", null);
    }

    /**
     * 플래너 정보 수정
     */
    @PutMapping("/api/v1/admin/planners/{plannerId}")
    @ResponseBody
    public ApiResponse<String> updatePlanner(@PathVariable int plannerId,
                                              @RequestBody PlannerDTO planner,
                                              HttpSession session) {
        planner.setPlannerId(plannerId);
        plannerService.updatePlanner(planner);
        return ApiResponse.success("플래너 정보가 수정되었습니다.", null);
    }

    /**
     * 플래너 선택 삭제 (다건)
     */
    @DeleteMapping("/api/v1/admin/planners")
    @ResponseBody
    public ApiResponse<String> deletePlanners(@RequestBody Map<String, List<Integer>> params,
                                               HttpSession session) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        List<Integer> ids = params.get("ids");
        
        plannerService.deletePlanners(ids, user != null ? user.getEmail() : "admin");
        return ApiResponse.success(ids.size() + "건이 삭제되었습니다.", null);
    }
}
