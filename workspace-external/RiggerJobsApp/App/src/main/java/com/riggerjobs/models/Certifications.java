package com.riggerjobs.models;

import java.util.List;

public class Certifications {
    private String certificationName;
    private String issuingAuthority;
    private String validUntil;

    public Certifications(String certificationName, String issuingAuthority, String validUntil) {
        this.certificationName = certificationName;
        this.issuingAuthority = issuingAuthority;
        this.validUntil = validUntil;
    }

    public String getCertificationName() {
        return certificationName;
    }

    public String getIssuingAuthority() {
        return issuingAuthority;
    }

    public String getValidUntil() {
        return validUntil;
    }
}

