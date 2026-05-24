package com.ntalk.choi.controller;

import com.ntalk.choi.domain.AccountDTO;
import com.ntalk.choi.domain.ChannelSendDTO;
import com.ntalk.choi.domain.common.ApiResponse;
import com.ntalk.choi.service.ChannelSendService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 채널 발송 (브랜드 메시지 발송) 컨트롤러 클래스
 */
@Controller
public class ChannelSendController {

    private static final Logger log = LoggerFactory.getLogger(ChannelSendController.class);

    private final ChannelSendService channelSendService;

    public ChannelSendController(ChannelSendService channelSendService) {
        this.channelSendService = channelSendService;
    }

    /**
     * 채널 발송 화면으로 이동
     */
    @GetMapping("/channelSend")
    public String channelSendPage(HttpSession session, Model model) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        if (user == null) {
            log.debug("Unauthenticated access to channelSend page, redirecting to /login");
            return "redirect:/login";
        }
        log.debug("Rendering channelSend page for user: {}", user.getEmail());
        model.addAttribute("user", user);
        return "channelSend";
    }

    /**
     * 브랜드 메시지 자유형 발송 API 엔드포인트
     */
    @PostMapping("/api/v1/channel/send")
    @ResponseBody
    public ApiResponse<String> sendBrandMessage(@RequestBody ChannelSendDTO dto, HttpSession session) {
        AccountDTO user = (AccountDTO) session.getAttribute("loginUser");
        if (user == null) {
            log.warn("Unauthenticated API call to /api/v1/channel/send");
            return ApiResponse.error("인증 세션이 만료되었습니다. 다시 로그인해 주세요.");
        }

        log.debug("API: sendBrandMessage called by {} - TargetType: {}, MsgType: {}", 
                user.getEmail(), dto.getTargetType(), dto.getMsgType());

        if (dto.getPhoneNum() == null || dto.getPhoneNum().trim().isEmpty()) {
            return ApiResponse.error("수신 번호를 입력해 주세요.");
        }
        if (dto.getSenderKey() == null || dto.getSenderKey().trim().isEmpty()) {
            return ApiResponse.error("발신 프로필 키를 입력해 주세요.");
        }
        if (dto.getMsgType() == null || dto.getMsgType().trim().isEmpty()) {
            return ApiResponse.error("발송 타입을 선택해 주세요.");
        }

        try {
            channelSendService.sendBrandMessage(dto);
            return ApiResponse.success("브랜드 메시지가 정상적으로 발송 큐에 등록되었습니다.", null);
        } catch (Exception e) {
            log.error("Failed to insert brand message into MZBRMSENDTRAN", e);
            return ApiResponse.error("브랜드 메시지 전송 처리에 실패했습니다: " + e.getMessage());
        }
    }
}
