package com.ntalk.choi.controller;

import com.ntalk.choi.domain.AccountDTO;
import com.ntalk.choi.service.SendStatService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminSendStatController {

    @Autowired
    private SendStatService sendStatService;

    @GetMapping("/send-stat")
    public String sendStatPage(HttpSession session, Model model) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        if (user == null) {
            return "redirect:/login";
        }
        model.addAttribute("user", user);
        return "admin/sendStatAdmin";
    }

    @GetMapping("/api/send-stat/today")
    @ResponseBody
    public ResponseEntity<?> getTodayStats(HttpSession session) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        Map<String, Object> stats = sendStatService.getTodayStats();
        return ResponseEntity.ok(stats);
    }
}
