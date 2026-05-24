package com.ntalk.choi.domain;

/**
 * 브랜드 메시지 발송 요청 DTO
 */
public class ChannelSendDTO {
    private String sn;
    private String senderKey;
    private String phoneNum;
    private String reqDtm;
    private String targetType;
    private String msgType;
    private String sndMsg;
    private String attachment;
    private String header;

    public ChannelSendDTO() {}

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public String getSenderKey() {
        return senderKey;
    }

    public void setSenderKey(String senderKey) {
        this.senderKey = senderKey;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getReqDtm() {
        return reqDtm;
    }

    public void setReqDtm(String reqDtm) {
        this.reqDtm = reqDtm;
    }

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public String getMsgType() {
        return msgType;
    }

    public void setMsgType(String msgType) {
        this.msgType = msgType;
    }

    public String getSndMsg() {
        return sndMsg;
    }

    public void setSndMsg(String sndMsg) {
        this.sndMsg = sndMsg;
    }

    public String getAttachment() {
        return attachment;
    }

    public void setAttachment(String attachment) {
        this.attachment = attachment;
    }

    public String getHeader() {
        return header;
    }

    public void setHeader(String header) {
        this.header = header;
    }
}
