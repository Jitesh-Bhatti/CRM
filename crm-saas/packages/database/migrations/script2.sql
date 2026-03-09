CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE admin_role AS ENUM (
    'superadmin',
    'support',
    'finance'
);

CREATE TYPE billing_cycle_type AS ENUM (
    'monthly',
    'yearly'
);

CREATE TYPE subscription_status AS ENUM (
    'active',
    'past_due',
    'cancelled'
);

CREATE TABLE super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    role admin_role NOT NULL DEFAULT 'support',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_super_admin_email
ON super_admins(email);




CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL UNIQUE,

    price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
    price_yearly NUMERIC(10,2) NOT NULL DEFAULT 0,

    max_users INTEGER,
    max_projects INTEGER,

    storage_limit_mb INTEGER,

    features_json JSONB,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_name
ON plans(name);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    plan_id UUID NOT NULL,

    billing_cycle billing_cycle_type NOT NULL DEFAULT 'monthly',

    status subscription_status NOT NULL DEFAULT 'active',

    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,

    next_billing_amount NUMERIC(10,2),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_subscriptions_plan
        FOREIGN KEY (plan_id)
        REFERENCES plans(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_subscriptions_org
ON subscriptions(organization_id);

CREATE INDEX idx_subscriptions_plan
ON subscriptions(plan_id);

CREATE INDEX idx_subscriptions_status
ON subscriptions(status);


CREATE TABLE subscription_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    metric_name VARCHAR(150) NOT NULL,

    metric_value BIGINT DEFAULT 0,

    period_start DATE NOT NULL,
    period_end DATE NOT NULL
);


CREATE INDEX idx_usage_org
ON subscription_usage(organization_id);

CREATE INDEX idx_usage_metric
ON subscription_usage(metric_name);

CREATE INDEX idx_usage_period
ON subscription_usage(period_start, period_end);


CREATE TABLE platform_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    admin_id UUID,

    action VARCHAR(150) NOT NULL,

    entity_type VARCHAR(150),
    entity_id UUID,

    metadata JSONB,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_platform_logs_admin
        FOREIGN KEY (admin_id)
        REFERENCES super_admins(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_platform_logs_admin
ON platform_logs(admin_id);

CREATE INDEX idx_platform_logs_entity
ON platform_logs(entity_type, entity_id);

CREATE INDEX idx_platform_logs_created
ON platform_logs(created_at DESC);



CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();






ALTER TABLE organizations
ADD COLUMN plan_id UUID,
ADD COLUMN is_suspended BOOLEAN DEFAULT FALSE,
ADD COLUMN suspended_reason TEXT,
ADD COLUMN onboarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;


ALTER TABLE organizations
ADD CONSTRAINT fk_organizations_plan
FOREIGN KEY (plan_id)
REFERENCES plans(id)
ON DELETE SET NULL;

CREATE INDEX idx_organizations_plan
ON organizations(plan_id);

CREATE INDEX idx_organizations_suspended
ON organizations(is_suspended);

ALTER TABLE organization_settings
ADD COLUMN custom_fields JSONB,
ADD COLUMN branding JSONB;

CREATE INDEX idx_org_settings_custom_fields
ON organization_settings
USING GIN(custom_fields);

CREATE INDEX idx_org_settings_branding
ON organization_settings
USING GIN(branding);

ALTER TABLE subscriptions
ADD CONSTRAINT unique_subscription_per_org
UNIQUE (organization_id);









ALTER TABLE users
ADD COLUMN is_org_owner BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_users_org_owner
ON users(organization_id, is_org_owner);

CREATE UNIQUE INDEX unique_org_owner
ON users(organization_id)
WHERE is_org_owner = TRUE;

CREATE TYPE role_scope AS ENUM (
    'global',
    'project',
    'client'
);

ALTER TABLE roles
ADD COLUMN scope role_scope DEFAULT 'global';


CREATE INDEX idx_roles_scope
ON roles(scope);









CREATE TYPE lead_status AS ENUM (
    'new',
    'contacted',
    'qualified',
    'lost'
);


CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    assigned_to UUID,

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),

    company VARCHAR(255),

    source VARCHAR(150),

    status lead_status DEFAULT 'new',

    lead_score INTEGER DEFAULT 0,

    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_leads_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_leads_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);


CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE INDEX idx_leads_org_id
ON leads(organization_id);


CREATE INDEX idx_leads_status
ON leads(status);


CREATE INDEX idx_leads_assigned_to
ON leads(assigned_to);


CREATE INDEX idx_leads_org_status
ON leads(organization_id, status);


CREATE UNIQUE INDEX unique_lead_email_per_org
ON leads(organization_id, email)
WHERE email IS NOT NULL;






















CREATE TYPE storage_provider_type AS ENUM (
    's3',
    'r2',
    'local'
);

ALTER TABLE files
ADD COLUMN storage_provider storage_provider_type DEFAULT 'local';

CREATE INDEX idx_files_storage_provider
ON files(storage_provider);







ALTER TABLE user_availability
ADD COLUMN available_hours_per_week INTEGER;

ALTER TABLE user_availability
ALTER COLUMN available_hours_per_week
SET DEFAULT 40;

ALTER TABLE user_availability
ADD CONSTRAINT check_available_hours
CHECK (available_hours_per_week >= 0 AND available_hours_per_week <= 168);










CREATE TYPE invoice_status AS ENUM (
    'paid',
    'pending',
    'failed'
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    organization_id UUID NOT NULL,

    subscription_id UUID NOT NULL,

    amount NUMERIC(12,2) NOT NULL,

    currency VARCHAR(10) DEFAULT 'USD',

    status invoice_status DEFAULT 'pending',

    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_at TIMESTAMP WITH TIME ZONE,

    paid_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_invoices_org
        FOREIGN KEY (organization_id)
        REFERENCES organizations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_invoices_subscription
        FOREIGN KEY (subscription_id)
        REFERENCES subscriptions(id)
        ON DELETE CASCADE
);






CREATE INDEX idx_invoices_org
ON invoices(organization_id);

CREATE INDEX idx_invoices_subscription
ON invoices(subscription_id);

CREATE INDEX idx_invoices_status
ON invoices(status);


CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    invoice_id UUID NOT NULL,

    provider VARCHAR(100) NOT NULL,

    transaction_ref VARCHAR(255),

    amount NUMERIC(12,2) NOT NULL,

    status invoice_status DEFAULT 'pending',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transactions_invoice
        FOREIGN KEY (invoice_id)
        REFERENCES invoices(id)
        ON DELETE CASCADE
);





CREATE INDEX idx_transactions_invoice
ON payment_transactions(invoice_id);

CREATE INDEX idx_transactions_provider
ON payment_transactions(provider);