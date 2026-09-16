package com.project.uvmp.config;

import com.project.uvmp.model.*;
import com.project.uvmp.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DistrictRepository districtRepository;
    private final NgoRepository ngoRepository;
    private final VolunteerRepository volunteerRepository;
    private final TaskRepository taskRepository;
    private final IncidentRepository incidentRepository;
    private final TaskAssignmentRepository taskAssignmentRepository;
    private final VolunteerRecognitionRepository volunteerRecognitionRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DistrictRepository districtRepository,
                           NgoRepository ngoRepository,
                           VolunteerRepository volunteerRepository,
                           TaskRepository taskRepository,
                           IncidentRepository incidentRepository,
                           TaskAssignmentRepository taskAssignmentRepository,
                           VolunteerRecognitionRepository volunteerRecognitionRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.districtRepository = districtRepository;
        this.ngoRepository = ngoRepository;
        this.volunteerRepository = volunteerRepository;
        this.taskRepository = taskRepository;
        this.incidentRepository = incidentRepository;
        this.taskAssignmentRepository = taskAssignmentRepository;
        this.volunteerRecognitionRepository = volunteerRecognitionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedDistricts();
        seedNgos();
        seedVolunteers();
        seedIncidents();
        seedTasks();
        seedAssignments();
        seedRecognitions();

        printTableCounts();
    }

    private void printTableCounts() {
        logger.info("========================================================================");
        logger.info("  UVMP PLATFORM DATABASE SYNCHRONIZATION SUMMARY");
        logger.info("========================================================================");
        logger.info("  users                  : {}", userRepository.count());
        logger.info("  districts              : {}", districtRepository.count());
        logger.info("  ngos                   : {}", ngoRepository.count());
        logger.info("  volunteers             : {}", volunteerRepository.count());
        logger.info("  tasks                  : {}", taskRepository.count());
        logger.info("  incidents              : {}", incidentRepository.count());
        logger.info("  task_assignments       : {}", taskAssignmentRepository.count());
        logger.info("  volunteer_recognitions : {}", volunteerRecognitionRepository.count());
        logger.info("========================================================================");
    }

    private void seedUsers() {
        seedUserIfNotExists("Platform Admin", "admin@uvmp.local", "Admin123!", Role.ADMIN);
        seedUserIfNotExists("District Authority Officer", "district@uvmp.local", "District123!", Role.DISTRICT_AUTHORITY);
        seedUserIfNotExists("Hope Relief NGO", "ngo1@uvmp.local", "Ngo123!", Role.NGO);
        seedUserIfNotExists("Alex Volunteer", "volunteer1@uvmp.local", "Volunteer123!", Role.VOLUNTEER);
    }

    private void seedUserIfNotExists(String name, String email, String rawPassword, Role role) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User(name, email, passwordEncoder.encode(rawPassword), role);
            userRepository.save(user);
            logger.info("Seeded user: {} [{}]", email, role);
        }
    }

    private void seedDistricts() {
        User districtAdmin = userRepository.findByEmail("district@uvmp.local").orElse(null);
        Long adminId = districtAdmin != null ? districtAdmin.getId() : 2L;

        createDistrictIfNotExists("Central Metro District", "Zone 1 - High Density Urban & Infrastructure Center", adminId);
        createDistrictIfNotExists("Coastal Maritime District", "Zone 2 - Flood Risk, Harbor & Lowland Estuary", adminId);
        createDistrictIfNotExists("Western Highland District", "Zone 3 - Mountainous Terrain, Landslide & Forest Hazard Corridor", adminId);
    }

    private void createDistrictIfNotExists(String name, String regionNotes, Long adminId) {
        if (!districtRepository.existsByName(name)) {
            District d = new District(name, regionNotes, adminId);
            districtRepository.save(d);
            logger.info("Seeded district: {}", name);
        }
    }

    private void seedNgos() {
        List<District> districts = districtRepository.findAll();
        Long d1Id = !districts.isEmpty() ? districts.get(0).getId() : 1L;
        Long d2Id = districts.size() > 1 ? districts.get(1).getId() : d1Id;
        Long d3Id = districts.size() > 2 ? districts.get(2).getId() : d1Id;

        User ngoUser = userRepository.findByEmail("ngo1@uvmp.local").orElse(null);
        Long ngoUserId = ngoUser != null ? ngoUser.getId() : null;

        createOrUpdateNgo(1L, "Hope Relief Network", d1Id, ngoUserId, "APPROVED",
                "Disaster Response Desk, Building 4", "contact@hoperelief.org", "+91 98450 11223");
        createOrUpdateNgo(2L, "Red Cross Emergency Wing", d1Id, null, "APPROVED",
                "Sector 2 Urban Relief Center", "relief@redcross.local", "+91 98450 44556");
        createOrUpdateNgo(3L, "Coastal Marine Lifeguard Corps", d2Id, null, "APPROVED",
                "Harbor Wharf Pier 9", "operations@coastallifeguard.org", "+91 98450 77889");
        createOrUpdateNgo(4L, "Blue Shield Ocean Rescue", d2Id, null, "APPROVED",
                "South Beach Marine Station", "rescue@blueshield.org", "+91 98450 99001");
        createOrUpdateNgo(5L, "Western Ghats Mountain Rescue", d3Id, null, "APPROVED",
                "Highland Station HQ, Ridge Road", "contact@mountainrescue.org", "+91 98450 33445");
        createOrUpdateNgo(6L, "Apex Medical & Disaster Relief", d3Id, null, "APPROVED",
                "Valley Hospital Complex Wing B", "dispatch@apexrelief.org", "+91 98450 66778");
    }

    private void createOrUpdateNgo(Long id, String name, Long districtId, Long userId, String status,
                                   String contactInfo, String email, String phone) {
        Optional<Ngo> byId = ngoRepository.findById(id);
        if (byId.isPresent()) {
            Ngo ngo = byId.get();
            ngo.setName(name);
            ngo.setDistrictId(districtId);
            ngo.setRegistrationStatus("APPROVED");
            ngo.setContactInfo(contactInfo);
            ngo.setEmail(email);
            ngo.setPhone(phone);
            if (userId != null && (ngo.getUserId() == null || ngo.getUserId().equals(userId))) {
                ngo.setUserId(userId);
            }
            ngoRepository.save(ngo);
        } else if (!ngoRepository.existsByName(name)) {
            Long safeUserId = null;
            if (userId != null && ngoRepository.findByUserId(userId).isEmpty()) {
                safeUserId = userId;
            }
            Ngo ngo = new Ngo(name, districtId, safeUserId, status, contactInfo, email, phone);
            ngoRepository.save(ngo);
            logger.info("Seeded NGO: {}", name);
        }
    }

    private void seedVolunteers() {
        List<District> districts = districtRepository.findAll();
        Long d1Id = !districts.isEmpty() ? districts.get(0).getId() : 1L;
        Long d2Id = districts.size() > 1 ? districts.get(1).getId() : d1Id;
        Long d3Id = districts.size() > 2 ? districts.get(2).getId() : d1Id;

        List<Ngo> ngos = ngoRepository.findAll();
        Long n1 = !ngos.isEmpty() ? ngos.get(0).getId() : 1L;
        Long n2 = ngos.size() > 1 ? ngos.get(1).getId() : n1;
        Long n3 = ngos.size() > 2 ? ngos.get(2).getId() : n1;
        Long n4 = ngos.size() > 3 ? ngos.get(3).getId() : n1;
        Long n5 = ngos.size() > 4 ? ngos.get(4).getId() : n1;
        Long n6 = ngos.size() > 5 ? ngos.get(5).getId() : n1;

        User volUser = userRepository.findByEmail("volunteer1@uvmp.local").orElse(null);
        Long vol1UserId = volUser != null ? volUser.getId() : null;

        // 25 volunteers with varied reliability spanning 40% to 98.5%
        VolunteerSpec[] specs = new VolunteerSpec[] {
            // Central Metro District (Bangalore Coordinates: 12.9716, 77.5946)
            new VolunteerSpec(vol1UserId, n1, d1Id, "Alex Volunteer", "volunteer1@uvmp.local", "+91 98765 43210", 12.9716, 77.5946, "AVAILABLE", 95.0, "First Aid, Search & Rescue, CPR, Fire Safety"),
            new VolunteerSpec(null, n1, d1Id, "Dr. Priya Sharma", "priya.sharma@uvmp.local", "+91 98765 11111", 12.9780, 77.6020, "AVAILABLE", 98.5, "Medical, Trauma Care, Nursing, CPR"),
            new VolunteerSpec(null, n1, d1Id, "Rahul Verma", "rahul.v@uvmp.local", "+91 98765 22222", 12.9650, 77.5850, "BUSY", 88.0, "Heavy Driving, Logistics, Supply Distribution"),
            new VolunteerSpec(null, n2, d1Id, "David Chen", "david.c@uvmp.local", "+91 98765 33333", 12.9820, 77.6100, "AVAILABLE", 92.0, "Water Rescue, Boat Operations, Swimming"),
            new VolunteerSpec(null, n2, d1Id, "Fatima Zahra", "fatima.z@uvmp.local", "+91 98765 44444", 12.9600, 77.5900, "AVAILABLE", 94.5, "First Aid, CPR, Counseling, Translation"),
            new VolunteerSpec(null, n1, d1Id, "Karthik Subramanian", "karthik.s@uvmp.local", "+91 98765 55555", 12.9850, 77.5750, "AVAILABLE", 86.0, "Drone Reconnaissance, Logistics, Electrical Repair"),
            new VolunteerSpec(null, n2, d1Id, "Meera Nair", "meera.n@uvmp.local", "+91 98765 66666", 12.9550, 77.6200, "OFFLINE", 63.5, "First Aid, Supply Distribution, Food Prep"),
            new VolunteerSpec(null, n1, d1Id, "Arjun Singh", "arjun.s@uvmp.local", "+91 98765 77777", 12.9900, 77.5950, "AVAILABLE", 91.0, "Search & Rescue, Fire Safety, Heavy Lifting"),

            // Coastal Maritime District (Chennai Coordinates: 13.0827, 80.2707)
            new VolunteerSpec(null, n3, d2Id, "Captain Rajesh Pillai", "rajesh.p@uvmp.local", "+91 98765 88888", 13.0850, 80.2750, "AVAILABLE", 97.0, "Water Rescue, Boat Operations, Marine Navigation, CPR"),
            new VolunteerSpec(null, n3, d2Id, "Ananya Sundaram", "ananya.s@uvmp.local", "+91 98765 99991", 13.0780, 80.2650, "AVAILABLE", 93.0, "First Aid, Medical, Triage, Swimming"),
            new VolunteerSpec(null, n4, d2Id, "Suresh Kumar", "suresh.k@uvmp.local", "+91 98765 99992", 13.0920, 80.2800, "BUSY", 85.0, "Logistics, Heavy Driving, Crane Operations"),
            new VolunteerSpec(null, n4, d2Id, "Pooja Reddy", "pooja.r@uvmp.local", "+91 98765 99993", 13.0700, 80.2580, "AVAILABLE", 89.5, "Drone Reconnaissance, Search & Rescue, GIS Mapping"),
            new VolunteerSpec(null, n3, d2Id, "Manish Joshi", "manish.j@uvmp.local", "+91 98765 99994", 13.0880, 80.2850, "AVAILABLE", 78.0, "Water Rescue, Swimming, First Aid"),
            new VolunteerSpec(null, n4, d2Id, "Swati Bose", "swati.b@uvmp.local", "+91 98765 99995", 13.0650, 80.2500, "OFFLINE", 55.0, "Counseling, Translation, Shelter Coordination"),
            new VolunteerSpec(null, n3, d2Id, "Deepak Yadav", "deepak.y@uvmp.local", "+91 98765 99996", 13.0950, 80.2900, "AVAILABLE", 90.5, "Boat Operations, Electrical Repair, Dewatering"),
            new VolunteerSpec(null, n4, d2Id, "Sneha Patil", "sneha.p@uvmp.local", "+91 98765 99997", 13.0750, 80.2600, "BUSY", 87.0, "First Aid, CPR, Child Care, Sanitation"),

            // Western Highland District (Highland Coordinates: 11.4102, 76.6950)
            new VolunteerSpec(null, n5, d3Id, "Vikram Aditya", "vikram.a@uvmp.local", "+91 98765 99998", 11.4150, 76.7000, "AVAILABLE", 96.0, "Mountain Rescue, Climbing, Rope Rigging, Search & Rescue"),
            new VolunteerSpec(null, n5, d3Id, "Tanvi Sharma", "tanvi.sh@uvmp.local", "+91 98765 99999", 11.4080, 76.6900, "AVAILABLE", 94.0, "Wilderness First Aid, Trauma Care, Hypothermia Treatment"),
            new VolunteerSpec(null, n6, d3Id, "Gautam Menon", "gautam.m@uvmp.local", "+91 98765 00001", 11.4200, 76.7100, "AVAILABLE", 82.5, "4x4 Off-road Driving, Logistics, Radio Communications"),
            new VolunteerSpec(null, n6, d3Id, "Kavita Krishnan", "kavita.k@uvmp.local", "+91 98765 00002", 11.4020, 76.6850, "BUSY", 72.0, "Search & Rescue, K9 Handling, Tracking"),
            new VolunteerSpec(null, n5, d3Id, "Ashok Kumar", "ashok.ku@uvmp.local", "+91 98765 00003", 11.4250, 76.7150, "AVAILABLE", 67.5, "Heavy Equipment, Earth Moving, Debris Clearing"),
            new VolunteerSpec(null, n6, d3Id, "Divya Bharathi", "divya.b@uvmp.local", "+91 98765 00004", 11.3980, 76.6800, "AVAILABLE", 92.5, "First Aid, CPR, Triage, Camp Hygiene"),
            new VolunteerSpec(null, n5, d3Id, "Sanjay Rawat", "sanjay.r@uvmp.local", "+91 98765 00005", 11.4300, 76.7200, "OFFLINE", 42.0, "Shelter Setup, Carpentry, Water Filtration"),
            new VolunteerSpec(null, n6, d3Id, "Riya Sen", "riya.s@uvmp.local", "+91 98765 00006", 11.4050, 76.6920, "AVAILABLE", 88.0, "Drone Reconnaissance, Thermal Imaging, GIS Mapping"),
            new VolunteerSpec(null, n5, d3Id, "Manoj Tiwari", "manoj.t@uvmp.local", "+91 98765 00007", 11.4120, 76.6980, "AVAILABLE", 59.0, "Fire Safety, Hazardous Cleanup, First Aid")
        };

        List<Volunteer> allVolunteers = volunteerRepository.findAll();
        List<Volunteer> blankVolunteers = allVolunteers.stream()
                .filter(v -> v.getName() == null || v.getName().isBlank() || "null".equalsIgnoreCase(v.getName()))
                .toList();

        int blankIdx = 0;
        for (VolunteerSpec s : specs) {
            Optional<Volunteer> byEmail = volunteerRepository.findByEmail(s.email);
            if (byEmail.isPresent()) {
                Volunteer v = byEmail.get();
                v.setName(s.name);
                v.setPhone(s.phone);
                v.setNgoId(s.ngoId);
                v.setDistrictId(s.districtId);
                v.setLatitude(s.lat);
                v.setLongitude(s.lng);
                v.setAvailability(s.availability);
                v.setReliabilityScore(s.reliability);
                v.setSkills(s.skills);
                volunteerRepository.save(v);
            } else if (blankIdx < blankVolunteers.size()) {
                Volunteer v = blankVolunteers.get(blankIdx++);
                v.setName(s.name);
                v.setEmail(s.email);
                v.setPhone(s.phone);
                v.setNgoId(s.ngoId);
                v.setDistrictId(s.districtId);
                v.setLatitude(s.lat);
                v.setLongitude(s.lng);
                v.setAvailability(s.availability);
                v.setReliabilityScore(s.reliability);
                v.setSkills(s.skills);
                volunteerRepository.save(v);
            } else {
                Volunteer v = new Volunteer(null, s.ngoId, s.districtId, s.name, s.email, s.phone,
                        s.lat, s.lng, s.availability, s.reliability, s.skills);
                volunteerRepository.save(v);
            }
        }
    }

    private static class VolunteerSpec {
        Long userId;
        Long ngoId;
        Long districtId;
        String name;
        String email;
        String phone;
        Double lat;
        Double lng;
        String availability;
        Double reliability;
        String skills;

        VolunteerSpec(Long userId, Long ngoId, Long districtId, String name, String email, String phone,
                      Double lat, Double lng, String availability, Double reliability, String skills) {
            this.userId = userId;
            this.ngoId = ngoId;
            this.districtId = districtId;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.lat = lat;
            this.lng = lng;
            this.availability = availability;
            this.reliability = reliability;
            this.skills = skills;
        }
    }

    private void seedIncidents() {
        createIncidentIfNotExists(
                "Vikram Roy", "+91 98765 99881", "vikram@example.com",
                "Flooding & Waterlogging", "CRITICAL",
                "Severe waterlogging near Metro Station Pillar 42. Approximately 15 citizens trapped on high curb with rising water.",
                "Metro Station Pillar 42, Central Cross Road",
                12.9725, 77.5950, 15, IncidentStatus.CONVERTED_TO_TASK
        );

        createIncidentIfNotExists(
                "Ananya Deshmukh", "+91 98765 99882", "ananya@example.com",
                "Structural Collapse & Debris", "HIGH",
                "Old residential boundary wall collapsed onto main access lane. Road blocked for emergency ambulances.",
                "Lane 3, Behind City Hospital",
                12.9680, 77.5890, 4, IncidentStatus.CONVERTED_TO_TASK
        );

        createIncidentIfNotExists(
                "Ramesh Patel", "+91 98765 99883", "ramesh@example.com",
                "Food, Water & Essential Supplies", "MEDIUM",
                "Temporary relief camp at Community Hall running critically low on potable drinking water and baby formula.",
                "Community Center, Sector 4",
                12.9750, 77.6050, 45, IncidentStatus.CONVERTED_TO_TASK
        );

        createIncidentIfNotExists(
                "Siddharth Rao", "+91 98765 99884", "siddharth.r@example.com",
                "Fire Outbreak & Chemical Hazard", "CRITICAL",
                "Industrial warehouse transformer exploded, spreading thick black smoke into neighboring residential apartments.",
                "Plot 88, Electronic Industrial Zone",
                12.9810, 77.6150, 20, IncidentStatus.VERIFIED
        );

        createIncidentIfNotExists(
                "Kavitha Sundar", "+91 98765 99885", "kavitha.s@example.com",
                "Coastal High Tide Surge", "CRITICAL",
                "Sea water breached beach retaining wall into fishing settlement. 30 huts partially submerged; stranded fishermen needing extraction.",
                "Marina Harbor Fishermen Colony, Pier 4",
                13.0840, 80.2780, 30, IncidentStatus.VERIFIED
        );

        createIncidentIfNotExists(
                "Manoj Nambiar", "+91 98765 99886", "manoj.n@example.com",
                "Mountain Landslide Blockade", "HIGH",
                "Mudslide and fallen boulders blocked Highway 181 between Hairpin Bends 6 and 7. Tourist buses and supply trucks stranded.",
                "Ghat Pass Road, Mile Marker 24",
                11.4180, 76.7050, 50, IncidentStatus.REPORTED
        );

        createIncidentIfNotExists(
                "Bina Devi", "+91 98765 99887", "bina.d@example.com",
                "Medical Supply Emergency", "HIGH",
                "Community Primary Health Center generator failed during power outage. Insulin and antivenom cold storage endangered.",
                "Primary Health Center, Hillcrest Ward",
                11.4050, 76.6890, 10, IncidentStatus.REPORTED
        );

        createIncidentIfNotExists(
                "Anonymous Caller", "+91 98765 00000", "noreply@spam.com",
                "Unverified Hoax Alert", "LOW",
                "Reported toxic fumes at abandoned rail yard. District inspection confirmed zero hazardous substance detected.",
                "Abandoned Rail Yard Shed 4",
                12.9620, 77.5820, 0, IncidentStatus.REJECTED
        );
    }

    private void createIncidentIfNotExists(String name, String phone, String email, String type,
                                           String urgency, String description, String location,
                                           Double lat, Double lng, Integer affected, IncidentStatus status) {
        if (!incidentRepository.existsByDescription(description)) {
            Incident inc = new Incident(name, phone, email, type, urgency, description, location, lat, lng, affected);
            inc.setStatus(status);
            if (status == IncidentStatus.VERIFIED || status == IncidentStatus.CONVERTED_TO_TASK) {
                inc.setVerifiedBy(2L);
            }
            incidentRepository.save(inc);
            logger.info("Seeded incident: {} [{}]", type, status);
        }
    }

    private void seedTasks() {
        List<District> districts = districtRepository.findAll();
        Long d1Id = !districts.isEmpty() ? districts.get(0).getId() : 1L;
        Long d2Id = districts.size() > 1 ? districts.get(1).getId() : d1Id;
        Long d3Id = districts.size() > 2 ? districts.get(2).getId() : d1Id;

        List<Ngo> ngos = ngoRepository.findAll();
        Long n1 = !ngos.isEmpty() ? ngos.get(0).getId() : 1L;
        Long n2 = ngos.size() > 1 ? ngos.get(1).getId() : n1;
        Long n3 = ngos.size() > 2 ? ngos.get(2).getId() : n1;
        Long n4 = ngos.size() > 3 ? ngos.get(3).getId() : n1;
        Long n5 = ngos.size() > 4 ? ngos.get(4).getId() : n1;
        Long n6 = ngos.size() > 5 ? ngos.get(5).getId() : n1;

        // 15 realistic tasks spanning OPEN, ASSIGNED, IN_PROGRESS, COMPLETED and all urgency levels
        createTaskIfNotExists(
                "Metro Pillar 42 Evacuation & Dewatering",
                "Deploy inflatable rescue dinghies and high-capacity water pumps to evacuate trapped commuters.",
                2L, d1Id, n1, 1L,
                "Water Rescue, First Aid, Boat Operations",
                "Metro Station Pillar 42, Central Cross Road",
                12.9725, 77.5950,
                Urgency.CRITICAL, TaskStatus.IN_PROGRESS, 6, 2,
                LocalDateTime.now().minusHours(3), LocalDateTime.now().plusHours(5)
        );

        createTaskIfNotExists(
                "Sector 4 Potable Water Logistics Distribution",
                "Transport and distribute 2000 liters of bottled water and emergency survival rations.",
                2L, d1Id, n1, 3L,
                "Logistics, Heavy Driving, Supply Distribution",
                "Community Center, Sector 4",
                12.9750, 77.6050,
                Urgency.MEDIUM, TaskStatus.OPEN, 4, 0,
                LocalDateTime.now().plusHours(1), LocalDateTime.now().plusHours(6)
        );

        createTaskIfNotExists(
                "Lane 3 Structural Collapse Clearance & First Aid",
                "Clear collapsed boundary wall debris, stabilize electrical lines, and administer first aid to injured pedestrians.",
                2L, d1Id, n2, 2L,
                "First Aid, Search & Rescue, Heavy Driving",
                "Lane 3, Behind City Hospital",
                12.9680, 77.5890,
                Urgency.HIGH, TaskStatus.ASSIGNED, 4, 1,
                LocalDateTime.now().minusHours(1), LocalDateTime.now().plusHours(7)
        );

        createTaskIfNotExists(
                "Electronics City Industrial Fire Boundary Containment",
                "Support fire service perimeter control, distribute smoke respirators, and evacuate senior citizens.",
                2L, d1Id, n2, 4L,
                "Fire Safety, CPR, Search & Rescue",
                "Plot 88, Electronic Industrial Zone",
                12.9810, 77.6150,
                Urgency.CRITICAL, TaskStatus.OPEN, 8, 0,
                LocalDateTime.now().plusHours(2), LocalDateTime.now().plusHours(10)
        );

        createTaskIfNotExists(
                "Marina Beach Fishermen Coastal Surge Extraction",
                "Deploy inflatable surf rescue crafts, extract 30 stranded families, and establish emergency triage tent.",
                2L, d2Id, n3, 5L,
                "Water Rescue, Boat Operations, Swimming, First Aid",
                "Marina Harbor Fishermen Colony, Pier 4",
                13.0840, 80.2780,
                Urgency.CRITICAL, TaskStatus.IN_PROGRESS, 6, 2,
                LocalDateTime.now().minusHours(2), LocalDateTime.now().plusHours(6)
        );

        createTaskIfNotExists(
                "Coastal Pier 9 High-Volume Dewatering Operation",
                "Operate submersible diesel pumps to drain flooded seawater from ground-floor electrical sub-stations.",
                2L, d2Id, n4, null,
                "Boat Operations, Electrical Repair, Logistics",
                "Wharf Road Electrical Substation, Pier 9",
                13.0860, 80.2810,
                Urgency.HIGH, TaskStatus.OPEN, 4, 0,
                LocalDateTime.now().plusHours(3), LocalDateTime.now().plusHours(9)
        );

        createTaskIfNotExists(
                "Harbor Relief Camp Food & Sanitation Logistics",
                "Set up mobile kitchens, distribute dry ration kits, and install portable water chlorination tanks.",
                2L, d2Id, n3, null,
                "Logistics, Heavy Driving, Food Prep",
                "Government High School Ground, Coastal Road",
                13.0760, 80.2620,
                Urgency.MEDIUM, TaskStatus.ASSIGNED, 5, 1,
                LocalDateTime.now().minusHours(1), LocalDateTime.now().plusHours(8)
        );

        createTaskIfNotExists(
                "Marina Shoreline Debris & Marine Hazard Cleanup",
                "Clear washed-up maritime flotsam, sharp debris, and hazardous oil slick absorbent barriers.",
                2L, d2Id, n4, null,
                "Search & Rescue, Heavy Lifting, Hazardous Cleanup",
                "South Promenade Shoreline",
                13.0710, 80.2550,
                Urgency.LOW, TaskStatus.COMPLETED, 4, 4,
                LocalDateTime.now().minusDays(1), LocalDateTime.now().minusHours(4)
        );

        createTaskIfNotExists(
                "Ghat Pass Landslide Obstacle Clearance & Evacuation",
                "Operate winches, remove boulders, clear debris with chainsaws, and ferry stranded bus passengers to safety.",
                2L, d3Id, n5, 6L,
                "Mountain Rescue, Climbing, Heavy Equipment, Search & Rescue",
                "Ghat Pass Road, Mile Marker 24",
                11.4180, 76.7050,
                Urgency.CRITICAL, TaskStatus.IN_PROGRESS, 6, 1,
                LocalDateTime.now().minusHours(4), LocalDateTime.now().plusHours(8)
        );

        createTaskIfNotExists(
                "Primary Health Center Emergency Power & Cold Chain Rescue",
                "Transport portable Honda 5kVA generators via 4x4 vehicles to restore hospital cold chain refrigerators.",
                2L, d3Id, n6, 7L,
                "Logistics, 4x4 Off-road Driving, Electrical Repair",
                "Primary Health Center, Hillcrest Ward",
                11.4050, 76.6890,
                Urgency.HIGH, TaskStatus.OPEN, 3, 0,
                LocalDateTime.now().plusHours(1), LocalDateTime.now().plusHours(5)
        );

        createTaskIfNotExists(
                "Valley Lowland Flash Flood Drone Reconnaissance",
                "Deploy thermal imaging drones to survey isolated homesteads and map riverbank erosion pathways.",
                2L, d3Id, n5, null,
                "Drone Reconnaissance, Thermal Imaging, GIS Mapping",
                "Valley Overlook Watchtower",
                11.4120, 76.6990,
                Urgency.HIGH, TaskStatus.ASSIGNED, 2, 1,
                LocalDateTime.now().minusHours(2), LocalDateTime.now().plusHours(4)
        );

        createTaskIfNotExists(
                "Hillcrest Community Hypothermia Prevention Distribution",
                "Distribute wool blankets, thermal sleeping mats, and hot broth to displaced tribal settlement families.",
                2L, d3Id, n6, null,
                "Wilderness First Aid, Trauma Care, Counseling",
                "Hillcrest Community Hall",
                11.4010, 76.6820,
                Urgency.MEDIUM, TaskStatus.COMPLETED, 4, 4,
                LocalDateTime.now().minusDays(2), LocalDateTime.now().minusDays(1)
        );

        createTaskIfNotExists(
                "Central Metro Hospital Ambulance Route Traffic Clearance",
                "Coordinate traffic diversion and clear flash-flooded underpasses to ensure uninterrupted emergency ambulance access.",
                2L, d1Id, n1, null,
                "First Aid, Logistics, CPR",
                "Underpass Junction, Ring Road",
                12.9640, 77.5870,
                Urgency.HIGH, TaskStatus.COMPLETED, 3, 3,
                LocalDateTime.now().minusDays(3), LocalDateTime.now().minusDays(2)
        );

        createTaskIfNotExists(
                "Western Ghats Tea Plantation Mudflow Perimeter Wall",
                "Construct sandbag deflection barriers to redirect active rainwater mudflow away from worker dormitories.",
                2L, d3Id, n5, null,
                "Heavy Lifting, Logistics, Earth Moving",
                "Estate Sector 9, Upper Valley",
                11.4220, 76.7120,
                Urgency.HIGH, TaskStatus.OPEN, 5, 0,
                LocalDateTime.now().plusHours(2), LocalDateTime.now().plusHours(8)
        );

        createTaskIfNotExists(
                "South Harbor Chemical Barrel Containment & Neutralization",
                "Secure dislodged caustic cleaning drums washed into stormwater drains and set up absorbent booms.",
                2L, d2Id, n4, null,
                "Hazardous Cleanup, Fire Safety, First Aid",
                "Chemical Dock Basin 3",
                13.0890, 80.2830,
                Urgency.CRITICAL, TaskStatus.OPEN, 6, 0,
                LocalDateTime.now().plusHours(1), LocalDateTime.now().plusHours(7)
        );
    }

    private void createTaskIfNotExists(String title, String description, Long createdBy, Long districtId,
                                      Long ngoId, Long incidentId, String requiredSkills, String locationAddress,
                                      Double lat, Double lng, Urgency urgency, TaskStatus status,
                                      Integer needed, Integer assigned, LocalDateTime start, LocalDateTime end) {
        if (!taskRepository.existsByTitle(title)) {
            Task task = new Task(title, description, createdBy, districtId, ngoId, incidentId,
                    requiredSkills, locationAddress, lat, lng, urgency, needed, start, end);
            task.setStatus(status);
            task.setVolunteersAssigned(assigned != null ? assigned : 0);
            taskRepository.save(task);
            logger.info("Seeded task: {} [{}]", title, status);
        }
    }

    private void seedAssignments() {
        List<Task> tasks = taskRepository.findAll();
        List<Volunteer> vols = volunteerRepository.findAll();

        if (tasks.isEmpty() || vols.isEmpty()) return;

        Task metroTask = tasks.stream()
                .filter(t -> t.getTitle().contains("Metro Pillar 42"))
                .findFirst().orElse(tasks.get(0));

        Task marinaTask = tasks.stream()
                .filter(t -> t.getTitle().contains("Marina Beach"))
                .findFirst().orElse(null);

        Task landslideTask = tasks.stream()
                .filter(t -> t.getTitle().contains("Landslide Obstacle"))
                .findFirst().orElse(null);

        Task laneTask = tasks.stream()
                .filter(t -> t.getTitle().contains("Lane 3"))
                .findFirst().orElse(null);

        Volunteer vAlex = vols.stream()
                .filter(v -> v.getEmail().equals("volunteer1@uvmp.local"))
                .findFirst().orElse(vols.get(0));

        Volunteer vPriya = vols.stream()
                .filter(v -> v.getEmail().contains("priya"))
                .findFirst().orElse(vols.size() > 1 ? vols.get(1) : vols.get(0));

        Volunteer vRajesh = vols.stream()
                .filter(v -> v.getEmail().contains("rajesh"))
                .findFirst().orElse(vols.size() > 8 ? vols.get(8) : vols.get(0));

        Volunteer vAnanya = vols.stream()
                .filter(v -> v.getEmail().contains("ananya"))
                .findFirst().orElse(vols.size() > 9 ? vols.get(9) : vols.get(0));

        Volunteer vVikram = vols.stream()
                .filter(v -> v.getEmail().contains("vikram"))
                .findFirst().orElse(vols.size() > 16 ? vols.get(16) : vols.get(0));

        Volunteer vRahul = vols.stream()
                .filter(v -> v.getEmail().contains("rahul"))
                .findFirst().orElse(vols.size() > 2 ? vols.get(2) : vols.get(0));

        // Metro task assignments
        createAssignmentIfNotExists(metroTask.getId(), vAlex.getId(), "IN_PROGRESS", 4.5, 94.0);
        createAssignmentIfNotExists(metroTask.getId(), vPriya.getId(), "IN_PROGRESS", 4.0, 97.5);

        // Marina task assignments
        if (marinaTask != null) {
            createAssignmentIfNotExists(marinaTask.getId(), vRajesh.getId(), "IN_PROGRESS", 5.0, 96.0);
            createAssignmentIfNotExists(marinaTask.getId(), vAnanya.getId(), "IN_PROGRESS", 3.5, 91.5);
        }

        // Landslide task assignment
        if (landslideTask != null) {
            createAssignmentIfNotExists(landslideTask.getId(), vVikram.getId(), "IN_PROGRESS", 6.0, 95.0);
        }

        // Lane 3 task assignment
        if (laneTask != null) {
            createAssignmentIfNotExists(laneTask.getId(), vRahul.getId(), "ASSIGNED", 0.0, 88.0);
        }
    }

    private void createAssignmentIfNotExists(Long taskId, Long volunteerId, String status, Double hours, Double matchScore) {
        if (!taskAssignmentRepository.existsByTaskIdAndVolunteerId(taskId, volunteerId)) {
            TaskAssignment a = new TaskAssignment(taskId, volunteerId, status, matchScore);
            a.setHoursLogged(hours != null ? hours : 0.0);
            taskAssignmentRepository.save(a);
            logger.info("Seeded task assignment: Task #{} -> Vol #{}", taskId, volunteerId);
        }
    }

    private void seedRecognitions() {
        List<Volunteer> vols = volunteerRepository.findAll();
        List<Ngo> ngos = ngoRepository.findAll();

        if (vols.isEmpty() || ngos.isEmpty()) return;

        Long ngo1Id = ngos.get(0).getId();
        Long ngoCoastalId = ngos.size() > 2 ? ngos.get(2).getId() : ngo1Id;
        Long ngoHighlandId = ngos.size() > 4 ? ngos.get(4).getId() : ngo1Id;

        Volunteer vAlex = vols.stream()
                .filter(v -> v.getEmail().equals("volunteer1@uvmp.local"))
                .findFirst().orElse(vols.get(0));

        Volunteer vPriya = vols.stream()
                .filter(v -> v.getEmail().contains("priya"))
                .findFirst().orElse(vols.get(0));

        Volunteer vRajesh = vols.stream()
                .filter(v -> v.getEmail().contains("rajesh"))
                .findFirst().orElse(vols.get(0));

        Volunteer vVikram = vols.stream()
                .filter(v -> v.getEmail().contains("vikram"))
                .findFirst().orElse(vols.get(0));

        Volunteer vAnanya = vols.stream()
                .filter(v -> v.getEmail().contains("ananya"))
                .findFirst().orElse(vols.get(0));

        createRecognitionIfNotExists(
                vAlex.getId(), ngo1Id, 1L,
                "Emergency Water Rescue Commendation",
                "Demonstrated exceptional courage and tactical precision assisting stranded commuters during critical monsoon waterlogging at Metro Station Pillar 42.",
                "LIFESAVER", 12.5, "UVMP-CERT-2026-HERO-001"
        );

        createRecognitionIfNotExists(
                vPriya.getId(), ngo1Id, 1L,
                "Outstanding Field Trauma Medical Leadership",
                "Triaged over 40 hypothermia and trauma casualties under severe storm conditions with zero preventable loss.",
                "HERO", 18.0, "UVMP-CERT-2026-HERO-002"
        );

        createRecognitionIfNotExists(
                vRajesh.getId(), ngoCoastalId, 5L,
                "Master Coastal Surf Extraction Medal",
                "Navigated high swell surf conditions to safely extract 30 stranded fishing families during coastal surge breach.",
                "FIELD_MASTER", 24.0, "UVMP-CERT-2026-HERO-003"
        );

        createRecognitionIfNotExists(
                vVikram.getId(), ngoHighlandId, 9L,
                "Alpine High-Angle Rope Rescue Citation",
                "Executed complex rope-rigging descent on active landslide face to evacuate immobilized passengers from stranded bus.",
                "COMMUNITY_STAR", 16.0, "UVMP-CERT-2026-HERO-004"
        );

        createRecognitionIfNotExists(
                vAnanya.getId(), ngoCoastalId, 5L,
                "Rapid Medical Triage Excellence",
                "Administered emergency hypothermia stabilization and pediatric triage under extreme coastal storm conditions.",
                "HERO", 14.0, "UVMP-CERT-2026-HERO-005"
        );
    }

    private void createRecognitionIfNotExists(Long volId, Long ngoId, Long taskId, String title,
                                             String description, String badgeType, Double hours, String certCode) {
        if (!volunteerRecognitionRepository.existsByCertificateCode(certCode)) {
            VolunteerRecognition r = new VolunteerRecognition(volId, ngoId, taskId, title, description, badgeType, hours, certCode);
            volunteerRecognitionRepository.save(r);
            logger.info("Seeded recognition certificate: {}", certCode);
        }
    }
}
