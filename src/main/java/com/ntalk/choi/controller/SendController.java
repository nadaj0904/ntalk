package com.ntalk.choi.controller;

import com.ntalk.choi.domain.AccountDTO;
import com.ntalk.choi.domain.CustomerDTO;
import com.ntalk.choi.domain.SendQueueDTO;
import com.ntalk.choi.domain.SendTemplateDTO;
import com.ntalk.choi.domain.common.ApiResponse;
import com.ntalk.choi.service.SendService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@Controller
public class SendController {
    private final SendService sendService;
    public SendController(SendService sendService) { this.sendService = sendService; }

    @GetMapping("/send")
    public String sendPage(HttpSession session, Model model) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        if (user == null) return "redirect:/login";
        model.addAttribute("user", user);
        return "send";
    }

    @GetMapping("/api/v1/send/planners")
    @ResponseBody
    public ApiResponse<List<CustomerDTO>> getPlanners() {
        return ApiResponse.success("성공", sendService.getPlannerListForSend());
    }

    @PostMapping("/api/v1/send/customers")
    @ResponseBody
    public ApiResponse<Map<String, Object>> getCustomers(@RequestBody Map<String, List<Integer>> params) {
        return ApiResponse.success("성공", sendService.getActiveCustomersByPlanners(params.get("plannerIds")));
    }

    @GetMapping("/api/v1/send/templates")
    @ResponseBody
    public ApiResponse<List<SendTemplateDTO>> getTemplates() {
        return ApiResponse.success("성공", sendService.getTemplateList());
    }

    @PostMapping("/api/v1/send/request")
    @ResponseBody
    public ApiResponse<String> requestSend(@RequestBody List<SendQueueDTO> sendList, HttpSession session) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        int count = sendService.requestBulkSend(sendList, user.getEmail());
        return ApiResponse.success(count + "건의 발송 요청이 등록되었습니다.", null);
    }
}
