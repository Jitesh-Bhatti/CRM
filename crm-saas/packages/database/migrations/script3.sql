
ALTER TABLE subscriptions
ADD CONSTRAINT fk_subscriptions_org
FOREIGN KEY (organization_id)
REFERENCES organizations(id)
ON DELETE CASCADE;

ALTER TABLE subscription_usage
ADD CONSTRAINT fk_subscription_usage_org
FOREIGN KEY (organization_id)
REFERENCES organizations(id)
ON DELETE CASCADE;

ALTER TABLE task_attachments
ADD CONSTRAINT fk_task_attachments_file
FOREIGN KEY (file_id)
REFERENCES files(id)
ON DELETE CASCADE;

ALTER TABLE organizations
ADD CONSTRAINT fk_organizations_owner_user
FOREIGN KEY (owner_user_id)
REFERENCES users(id)
ON DELETE SET NULL;

DROP INDEX IF EXISTS unique_lead_email_per_org;

CREATE UNIQUE INDEX unique_lead_email_company_per_org
ON leads(organization_id, email, company)
WHERE email IS NOT NULL;

ALTER TABLE leads
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE files
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE notifications
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_leads_deleted_at
ON leads(deleted_at);

CREATE INDEX idx_files_deleted_at
ON files(deleted_at);

CREATE INDEX idx_notifications_deleted_at
ON notifications(deleted_at);

CREATE OR REPLACE FUNCTION sync_org_plan()
RETURNS TRIGGER AS $$
BEGIN
   UPDATE organizations
   SET plan_id = NEW.plan_id
   WHERE id = NEW.organization_id;

   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_org_plan
AFTER INSERT OR UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION sync_org_plan();	

ALTER TABLE projects
ADD CONSTRAINT check_project_budget
CHECK (budget IS NULL OR budget >= 0);

ALTER TABLE files
ADD CONSTRAINT check_file_size
CHECK (file_size IS NULL OR file_size >= 0);

ALTER TABLE invoices
ADD CONSTRAINT check_invoice_amount
CHECK (amount >= 0);


CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    user_id UUID NOT NULL,
    project_id UUID,
    task_id UUID,

    hours NUMERIC(5,2) NOT NULL,

    description TEXT,

    billable BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_time_entries_org
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_time_entries_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_time_entries_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_time_entries_task
        FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_time_entries_org
ON time_entries(organization_id);

CREATE INDEX idx_time_entries_user
ON time_entries(user_id);

CREATE INDEX idx_time_entries_project
ON time_entries(project_id);

CREATE TABLE project_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,

    created_by UUID NOT NULL,

    title VARCHAR(255),
    content TEXT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_project_notes_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_notes_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,

    api_key_hash TEXT NOT NULL,

    created_by UUID,

    last_used_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    revoked_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_api_keys_org
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_api_keys_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_api_keys_org
ON api_keys(organization_id);

ALTER TABLE organizations 
  DROP CONSTRAINT fk_organizations_owner_user;

ALTER TABLE organizations 
  ADD CONSTRAINT fk_organizations_owner_user 
  FOREIGN KEY (owner_user_id) 
  REFERENCES users(id) 
  ON DELETE SET NULL 
  DEFERRABLE INITIALLY DEFERRED;