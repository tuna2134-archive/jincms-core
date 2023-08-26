CREATE TABLE IF NOT EXISTS Organization (
    id TEXT NOT NULL,
    name TEXT,
    ownerId TEXT
);
CREATE TABLE IF NOT EXISTS OrganizationMember {
    orgId TEXT,
    userId TEXT,
    role TEXT
};