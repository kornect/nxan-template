import { Migration } from '@mikro-orm/migrations';

export class Migration20230211195408 extends Migration {

  async up(): Promise<void> {
    this.addSql('create schema if not exists "auth";');

    this.addSql('create table "auth"."claims" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "type" text not null, "group" text null, constraint "claims_pkey" primary key ("id"));');
    this.addSql('alter table "auth"."claims" add constraint "claims_type_unique" unique ("type");');

    this.addSql('create table "auth"."roles" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" text not null, "description" text null, constraint "roles_pkey" primary key ("id"));');
    this.addSql('alter table "auth"."roles" add constraint "roles_name_unique" unique ("name");');

    this.addSql('create table "auth"."role_claims" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "role_id" uuid not null, "claim_id" uuid not null, "value" text null, constraint "role_claims_pkey" primary key ("id"));');

    this.addSql('create table "auth"."users" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "display_name" text not null, "username" text not null, "email" text not null, "new_email" text null, "email_confirmed" boolean not null default false, "password_hash" text not null, "security_stamp" text not null, "phone_number" text null, "phone_number_confirmed" boolean not null default false, "two_factor_enabled" boolean not null default false, "suspended" boolean not null default false, "suspension_end" timestamptz(0) null, "banned" boolean not null default false, "last_login_at" timestamptz(0) null, constraint "users_pkey" primary key ("id"));');
    this.addSql('alter table "auth"."users" add constraint "users_username_unique" unique ("username");');
    this.addSql('alter table "auth"."users" add constraint "users_email_unique" unique ("email");');
    this.addSql('alter table "auth"."users" add constraint "users_new_email_unique" unique ("new_email");');

    this.addSql('create table "auth"."user_claims" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" uuid not null, "claim_id" uuid not null, "value" text null, constraint "user_claims_pkey" primary key ("id"));');

    this.addSql('create table "auth"."user_roles" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" uuid not null, "role_id" uuid not null, constraint "user_roles_pkey" primary key ("id"));');

    this.addSql('create table "auth"."user_tokens" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "token" text not null, "type" text check ("type" in (\'email_confirmation\', \'email_change_confirmation\', \'password_reset\', \'phone_number_confirmation\')) not null, "expires_at" timestamptz(0) not null, "user_id" uuid not null, constraint "user_tokens_pkey" primary key ("id"));');

    this.addSql('alter table "auth"."role_claims" add constraint "role_claims_role_id_foreign" foreign key ("role_id") references "auth"."roles" ("id") on update cascade;');
    this.addSql('alter table "auth"."role_claims" add constraint "role_claims_claim_id_foreign" foreign key ("claim_id") references "auth"."claims" ("id") on update cascade;');

    this.addSql('alter table "auth"."user_claims" add constraint "user_claims_user_id_foreign" foreign key ("user_id") references "auth"."users" ("id") on update cascade;');
    this.addSql('alter table "auth"."user_claims" add constraint "user_claims_claim_id_foreign" foreign key ("claim_id") references "auth"."claims" ("id") on update cascade;');

    this.addSql('alter table "auth"."user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "auth"."users" ("id") on update cascade;');
    this.addSql('alter table "auth"."user_roles" add constraint "user_roles_role_id_foreign" foreign key ("role_id") references "auth"."roles" ("id") on update cascade;');

    this.addSql('alter table "auth"."user_tokens" add constraint "user_tokens_user_id_foreign" foreign key ("user_id") references "auth"."users" ("id") on update cascade;');
  }

}
