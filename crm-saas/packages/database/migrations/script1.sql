CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(150),
    timezone VARCHAR(100),
    country VARCHAR(100),
    logo_url TEXT,
    owner_user_id UUID NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE organization_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,
    
    working_hours_start TIME,
    working_hours_end TIME,
    
    notification_preferences JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_organization_settings_org
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE
);



CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organization_settings_updated_at
BEFORE UPDATE ON organization_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();




CREATE TYPE user_status AS ENUM (
    'active',
    'invited',
    'suspended'
);



CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,

    status user_status DEFAULT 'invited',

    timezone VARCHAR(100),

    last_login_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_users_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_email_per_org
        UNIQUE (organization_id, email)
);







CREATE TABLE user_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    password_hash TEXT NOT NULL,
    email_verified_at TIMESTAMP WITH TIME ZONE,

    reset_token TEXT,
    reset_token_expiry TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_credentials_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_credentials UNIQUE(user_id)
);









CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    refresh_token TEXT NOT NULL,

    ip_address INET,
    device_info TEXT,

    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sessions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);











CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_credentials_updated_at
BEFORE UPDATE ON user_credentials
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT
);




CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,
    description TEXT,

    is_system_role BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_roles_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_role_name_per_org
        UNIQUE (organization_id, name)
);










CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,

    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_role_permission
        UNIQUE (role_id, permission_id)
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    role_id UUID NOT NULL,

    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_role
        UNIQUE (user_id, role_id)
);









CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    company_name VARCHAR(255) NOT NULL,
    primary_contact_name VARCHAR(255),

    email VARCHAR(255),
    phone VARCHAR(50),

    address TEXT,
    country VARCHAR(100),
    timezone VARCHAR(100),

    notes TEXT,

    created_by UUID NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_clients_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_clients_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);







CREATE TABLE client_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_id UUID NOT NULL,

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),

    designation VARCHAR(150),
    is_primary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_contacts_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE
);



CREATE UNIQUE INDEX unique_primary_contact_per_client
ON client_contacts(client_id)
WHERE is_primary = TRUE;


CREATE TABLE client_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,
    tag_name VARCHAR(100) NOT NULL,

    CONSTRAINT fk_client_tags_org
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_tag_per_org
        UNIQUE (organization_id, tag_name)
);




CREATE TABLE client_tag_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_id UUID NOT NULL,
    tag_id UUID NOT NULL,

    CONSTRAINT fk_client_tag_map_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_client_tag_map_tag
        FOREIGN KEY (tag_id)
        REFERENCES client_tags(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_client_tag
        UNIQUE (client_id, tag_id)
);

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();







CREATE TYPE project_status AS ENUM (
    'planning',
    'active',
    'completed',
    'on_hold'
);




CREATE TYPE milestone_status AS ENUM (
    'pending',
    'in_progress',
    'completed'
);





CREATE TYPE approval_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);





CREATE TYPE change_request_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);





CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,
    client_id UUID NOT NULL,

    name VARCHAR(255) NOT NULL,
    project_type VARCHAR(150),

    description TEXT,

    start_date DATE,
    end_date DATE,

    status project_status DEFAULT 'planning',

    budget NUMERIC(12,2),

    created_by UUID NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_projects_org
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_projects_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_projects_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,
    user_id UUID NOT NULL,

    role_in_project VARCHAR(150),

    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_project_members_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_members_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_project_user
        UNIQUE (project_id, user_id)
);







CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    deadline DATE,

    status milestone_status DEFAULT 'pending',
    approval_status approval_status DEFAULT 'pending',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_milestones_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
);









CREATE TABLE project_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    requirement_text TEXT NOT NULL,

    created_by UUID NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_requirements_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_requirements_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);









CREATE TABLE change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    requested_by UUID NOT NULL,
    description TEXT NOT NULL,

    status change_request_status DEFAULT 'pending',

    approved_by UUID,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_change_requests_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_change_requests_requested_by
        FOREIGN KEY (requested_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_change_requests_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at
BEFORE UPDATE ON milestones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



CREATE TYPE task_priority AS ENUM (
    'low',
    'medium',
    'high'
);





CREATE TYPE task_status AS ENUM (
    'todo',
    'in_progress',
    'review',
    'completed'
);




CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,
    project_id UUID NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    assigned_to UUID,

    priority task_priority DEFAULT 'medium',
    status task_status DEFAULT 'todo',

    deadline DATE,

    created_by UUID NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_tasks_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tasks_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tasks_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_tasks_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);








CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    task_id UUID NOT NULL,
    user_id UUID NOT NULL,

    comment_text TEXT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_task_comments_task
        FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_task_comments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);










CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    task_id UUID NOT NULL,
    file_id UUID NOT NULL,

    CONSTRAINT fk_task_attachments_task
        FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE
);









CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();







CREATE TYPE availability_status AS ENUM (
    'available',
    'busy',
    'leave'
);





CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    skill_name VARCHAR(150) NOT NULL,
    experience_level VARCHAR(100),

    CONSTRAINT fk_user_skills_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_skill
        UNIQUE (user_id, skill_name)
);




CREATE TABLE user_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    status availability_status DEFAULT 'available',

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_availability_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_availability
        UNIQUE (user_id)
);



CREATE TYPE file_entity_type AS ENUM (
    'project',
    'task',
    'client'
);





CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,

    file_type VARCHAR(100),
    file_size BIGINT,

    uploaded_by UUID NOT NULL,

    entity_type file_entity_type,
    entity_id UUID,

    version INTEGER DEFAULT 1,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_files_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_files_uploaded_by
        FOREIGN KEY (uploaded_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);










CREATE TYPE notification_type AS ENUM (
    'task_assigned',
    'task_updated',
    'comment_added',
    'project_update',
    'system_alert'
);



CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,
    user_id UUID NOT NULL,

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    type notification_type,

    is_read BOOLEAN DEFAULT FALSE,

    entity_type file_entity_type,
    entity_id UUID,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE TYPE activity_entity_type AS ENUM (
    'organization',
    'user',
    'client',
    'project',
    'task',
    'milestone',
    'file'
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,
    user_id UUID,

    action VARCHAR(150) NOT NULL,

    entity_type activity_entity_type NOT NULL,
    entity_id UUID NOT NULL,

    old_data JSONB,
    new_data JSONB,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_logs_org
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_activity_logs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);



CREATE INDEX idx_org_owner_user_id ON organizations(owner_user_id);
CREATE INDEX idx_org_deleted_at ON organizations(deleted_at);


CREATE UNIQUE INDEX idx_org_settings_org_id
ON organization_settings(organization_id);


CREATE INDEX idx_users_org_id ON users(organization_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_last_login ON users(last_login_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

CREATE INDEX idx_users_org_status
ON users(organization_id, status);


CREATE INDEX idx_credentials_user_id ON user_credentials(user_id);
CREATE INDEX idx_credentials_reset_token ON user_credentials(reset_token);



CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_expiry ON user_sessions(expires_at);

CREATE INDEX idx_roles_org_id ON roles(organization_id);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);


CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);


CREATE INDEX idx_clients_org_id ON clients(organization_id);
CREATE INDEX idx_clients_created_by ON clients(created_by);
CREATE INDEX idx_clients_deleted_at ON clients(deleted_at);

CREATE INDEX idx_clients_org_name
ON clients(organization_id, company_name);


CREATE INDEX idx_client_contacts_client_id ON client_contacts(client_id);

CREATE INDEX idx_client_tags_org_id ON client_tags(organization_id);


CREATE INDEX idx_client_tag_map_client ON client_tag_map(client_id);
CREATE INDEX idx_client_tag_map_tag ON client_tag_map(tag_id);


CREATE INDEX idx_projects_org_id ON projects(organization_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_deleted_at ON projects(deleted_at);

CREATE INDEX idx_projects_org_status_dates
ON projects(organization_id, status, start_date, end_date);


CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);


CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_milestones_deadline ON milestones(deadline);
CREATE INDEX idx_milestones_status ON milestones(status);

CREATE INDEX idx_milestones_project_deadline
ON milestones(project_id, deadline);


CREATE INDEX idx_project_requirements_project_id
ON project_requirements(project_id);


CREATE INDEX idx_change_requests_project_id ON change_requests(project_id);
CREATE INDEX idx_change_requests_status ON change_requests(status);




CREATE INDEX idx_tasks_org_id ON tasks(organization_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_deleted_at ON tasks(deleted_at);

CREATE INDEX idx_tasks_project_status_deadline
ON tasks(project_id, status, deadline);

CREATE INDEX idx_tasks_assigned_status
ON tasks(assigned_to, status);


CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_user_id ON task_comments(user_id);


CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id);


CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);

CREATE UNIQUE INDEX idx_user_availability_user_id
ON user_availability(user_id);


CREATE INDEX idx_files_org_id ON files(organization_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);

CREATE INDEX idx_files_entity
ON files(entity_type, entity_id);



CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_org_id ON notifications(organization_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

CREATE INDEX idx_notifications_user_read_created
ON notifications(user_id, is_read, created_at DESC);



CREATE INDEX idx_activity_logs_org_id ON activity_logs(organization_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

CREATE INDEX idx_activity_logs_entity
ON activity_logs(entity_type, entity_id);

CREATE INDEX idx_activity_logs_old_data
ON activity_logs USING GIN(old_data);

CREATE INDEX idx_activity_logs_new_data
ON activity_logs USING GIN(new_data);
