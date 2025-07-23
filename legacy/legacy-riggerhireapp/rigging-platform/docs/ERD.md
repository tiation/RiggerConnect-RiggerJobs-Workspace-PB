# Entity-Relationship Diagram (ERD) for Rigging Platform

This file outlines the conceptual ERD for the Rigging Platform. The diagram includes core entities and their relationships.

## ERD Structure

1. **User Profiles**: Centralized user management with links to either Rigger Profiles or Client Profiles based on role.
   - Relationships: One-to-One with either RiggerProfile or ClientProfile.

2. **Rigger Profiles**: Employers for the rigging section with details on skills and job applications.
   - Has foreign key to User Profiles.
   - Relationships: Many-to-Many with Skills and Certifications. One-to-Many with Job Applications.

3. **Client Profiles**: Entities that manage job postings.
   - Has foreign key to User Profiles.
   - Relationships: One-to-Many with Job Postings.

4. **Job Postings**: Opportunities for Riggers linked with Skill and Equipment requirements.
   - Has foreign key to Client Profiles.
   - Relationships: One-to-Many with Job Applications, Skill, and Equipment Requirements.

5. **Bookings**: Finalized job assignments between Clients and Riggers.
   - Has foreign keys to Job Postings and corresponding Client and Rigger Profiles.

6. **Skills and Equipment**: Master List entities outlined separately and linked via m:n junction tables to both Job Postings and Rigger Profiles.

7. **Certifications**: Professional qualifications specifically linked to Rigger Profiles.

Relationships are visually mapped to maintain integrity across entities with necessary junction tables for m:n associations.

Refer to the below diagram image for a full visual:

![ERD Placeholder](../diagrams/ERD-placeholder.png)

The above placeholders should be replaced with the actual diagram images after creating them using a tool like Lucidchart or draw.io.
