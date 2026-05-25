package com.ntalk.choi.controller;

import com.ntalk.choi.domain.AccountDTO;
import com.ntalk.choi.service.AccountService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 관리자 로그인 및 로그아웃 처리를 위한 컨트롤러
 */
@Controller
public class LoginController {

    private static final Logger log = LoggerFactory.getLogger(LoginController.class);

    private final AccountService accountService;

    public LoginController(AccountService accountService) {
        this.accountService = accountService;
    }

    /**
     * 로그인 페이지 이동
     */
    @GetMapping("/login")
    public String loginPage(HttpSession session) {
        if (session.getAttribute("loginUser") != null) {
            log.debug("Session exists, redirecting to index");
            return "redirect:/";
        }
        return "login";
    }

    /**
     * 기존 Form Data 로그인 처리 로직 (Legacy)
     */
    @PostMapping("/login")
    public String loginProcess(
            @RequestParam("adminId") String adminId,
            @RequestParam("adminPw") String adminPw,
            HttpSession session,
            RedirectAttributes redirectAttributes) {
        
        log.debug("Received legacy POST login request for adminId: {}", adminId);
        AccountDTO loginUser = accountService.login(adminId, adminPw);

        if (loginUser != null) {
            log.debug("Legacy login successful. Setting session for user: {}", adminId);
            session.setAttribute("loginUser", loginUser);
            return "redirect:/index";
        } else {
            log.debug("Legacy login failed for user: {}", adminId);
            redirectAttributes.addFlashAttribute("error", "아이디 또는 비밀번호가 일치하지 않습니다.");
            return "redirect:/login";
        }
    }

    /**
     * 신규 AJAX 로그인 처리 로직 (ntalk_ajax 통신 표준 적용)
     */
    @PostMapping("/api/login")
    @org.springframework.web.bind.annotation.ResponseBody
    public com.ntalk.choi.domain.common.ApiResponse<String> loginAjax(
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> params,
            HttpSession session) {
        
        String adminId = params.get("adminId");
        String adminPw = params.get("adminPw");
        
        log.debug("Received AJAX login API request for adminId: {}", adminId);

        if (adminId == null || adminId.isEmpty() || adminPw == null || adminPw.isEmpty()) {
            log.debug("Validation failed during AJAX login: missing id or pw");
            return com.ntalk.choi.domain.common.ApiResponse.error("아이디와 비밀번호를 모두 입력해주세요.");
        }

        AccountDTO loginUser = accountService.login(adminId, adminPw);

        if (loginUser != null) {
            log.debug("AJAX login successful. Setting session for user: {}", adminId);
            session.setAttribute("loginUser", loginUser);
            // 인증 성공시 리다이렉트 할 대상 URL 리턴
            return com.ntalk.choi.domain.common.ApiResponse.success("로그인 성공", "/index");
        } else {
            log.debug("AJAX login failed: Invalid credentials for user: {}", adminId);
            return com.ntalk.choi.domain.common.ApiResponse.error("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    /**
     * 로그아웃 처리
     */
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        log.debug("Logging out user, invalidating session");
        session.invalidate(); // 세션 무효화
        return "redirect:/login";
    }

    /**
     * 비밀번호 찾기 페이지 이동
     */
    @GetMapping("/login/forgot-password")
    public String forgotPasswordPage() {
        return "login/forgot-password";
    }

    /**
     * 비밀번호 찾기 처리 (임시 비밀번호 발급 및 발송)
     */
    @PostMapping("/api/login/reset-password")
    @org.springframework.web.bind.annotation.ResponseBody
    public com.ntalk.choi.domain.common.ApiResponse<String> resetPasswordAjax(
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> params) {

        String email = params.get("email");
        String mobile = params.get("mobile");

        log.debug("Received AJAX reset-password request for email: {}, mobile: {}", email, mobile);

        if (email == null || email.isEmpty() || mobile == null || mobile.isEmpty()) {
            return com.ntalk.choi.domain.common.ApiResponse.error("이메일과 휴대폰 번호를 모두 입력해주세요.");
        }

        try {
            accountService.resetPassword(email, mobile);
            return com.ntalk.choi.domain.common.ApiResponse.success("임시 비밀번호가 휴대폰으로 발송되었습니다.", "/login");
        } catch (IllegalArgumentException e) {
            return com.ntalk.choi.domain.common.ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("Error during password reset", e);
            return com.ntalk.choi.domain.common.ApiResponse.error("비밀번호 초기화 중 서버 오류가 발생했습니다.");
        }
    }

    /**
     * 메인 페이지 이동 (로그인 확인용)
     */
    @GetMapping({"/", "/index"})
    public String mainPage(HttpSession session, Model model) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        if (user == null) {
            log.debug("Unauthenticated access to index page, redirecting to /login");
            return "redirect:/login";
        }
        
        log.debug("Rendering index page for user: {}", user.getEmail());
        model.addAttribute("user", user);
        return "index"; // index.html
    }
}
