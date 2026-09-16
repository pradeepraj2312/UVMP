package com.project.uvmp.dto.auth;

import java.util.List;

public class RegistrationOptionsResponse {

    private List<NgoOptionDto> ngos;
    private List<DistrictOptionDto> districts;

    public RegistrationOptionsResponse() {
    }

    public RegistrationOptionsResponse(List<NgoOptionDto> ngos, List<DistrictOptionDto> districts) {
        this.ngos = ngos;
        this.districts = districts;
    }

    public List<NgoOptionDto> getNgos() {
        return ngos;
    }

    public void setNgos(List<NgoOptionDto> ngos) {
        this.ngos = ngos;
    }

    public List<DistrictOptionDto> getDistricts() {
        return districts;
    }

    public void setDistricts(List<DistrictOptionDto> districts) {
        this.districts = districts;
    }

    public static class NgoOptionDto {
        private Long id;
        private String name;
        private Long districtId;
        private String districtName;

        public NgoOptionDto() {
        }

        public NgoOptionDto(Long id, String name, Long districtId, String districtName) {
            this.id = id;
            this.name = name;
            this.districtId = districtId;
            this.districtName = districtName;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getDistrictId() {
            return districtId;
        }

        public void setDistrictId(Long districtId) {
            this.districtId = districtId;
        }

        public String getDistrictName() {
            return districtName;
        }

        public void setDistrictName(String districtName) {
            this.districtName = districtName;
        }
    }

    public static class DistrictOptionDto {
        private Long id;
        private String name;
        private String region;

        public DistrictOptionDto() {
        }

        public DistrictOptionDto(Long id, String name, String region) {
            this.id = id;
            this.name = name;
            this.region = region;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }
    }
}
