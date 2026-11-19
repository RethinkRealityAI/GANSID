import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Website content lives in its own schema, separate from the Congress tables in the same database.
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS "payload"`);
  await db.execute(sql`
   CREATE TYPE "payload"."enum_events_type" AS ENUM('roundtable', 'awareness-day', 'launch', 'webinar', 'meeting', 'seminar', 'other');
  CREATE TYPE "payload"."enum_events_format" AS ENUM('in-person', 'online', 'hybrid');
  CREATE TYPE "payload"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__events_v_version_type" AS ENUM('roundtable', 'awareness-day', 'launch', 'webinar', 'meeting', 'seminar', 'other');
  CREATE TYPE "payload"."enum__events_v_version_format" AS ENUM('in-person', 'online', 'hybrid');
  CREATE TYPE "payload"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__events_v_published_locale" AS ENUM('en', 'fr');
  CREATE TYPE "payload"."enum_galleries_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__galleries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__galleries_v_published_locale" AS ENUM('en', 'fr');
  CREATE TYPE "payload"."enum_resources_topics" AS ENUM('sickle-cell', 'thalassemia', 'bleeding-disorders', 'bone-marrow-failure', 'enzymopathies', 'hereditary-spherocytosis', 'clinical-trials', 'advocacy', 'congress');
  CREATE TYPE "payload"."enum_resources_type" AS ENUM('toolkit', 'guide', 'pdf', 'video', 'webcast', 'ebook', 'presentation', 'podcast');
  CREATE TYPE "payload"."enum_resources_source" AS ENUM('link', 'file');
  CREATE TYPE "payload"."enum_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__resources_v_version_topics" AS ENUM('sickle-cell', 'thalassemia', 'bleeding-disorders', 'bone-marrow-failure', 'enzymopathies', 'hereditary-spherocytosis', 'clinical-trials', 'advocacy', 'congress');
  CREATE TYPE "payload"."enum__resources_v_version_type" AS ENUM('toolkit', 'guide', 'pdf', 'video', 'webcast', 'ebook', 'presentation', 'podcast');
  CREATE TYPE "payload"."enum__resources_v_version_source" AS ENUM('link', 'file');
  CREATE TYPE "payload"."enum__resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__resources_v_published_locale" AS ENUM('en', 'fr');
  CREATE TYPE "payload"."enum_congress_editions_sponsors_tier" AS ENUM('platinum', 'gold', 'silver', 'bronze', 'supporter');
  CREATE TYPE "payload"."enum_congress_editions_format" AS ENUM('in-person', 'virtual', 'hybrid');
  CREATE TYPE "payload"."enum_congress_editions_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__congress_editions_v_version_sponsors_tier" AS ENUM('platinum', 'gold', 'silver', 'bronze', 'supporter');
  CREATE TYPE "payload"."enum__congress_editions_v_version_format" AS ENUM('in-person', 'virtual', 'hybrid');
  CREATE TYPE "payload"."enum__congress_editions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__congress_editions_v_published_locale" AS ENUM('en', 'fr');
  CREATE TYPE "payload"."enum_people_roles" AS ENUM('board', 'team', 'speaker', 'scientific-committee', 'planning-team', 'ecourse-author', 'moderator');
  CREATE TYPE "payload"."enum_people_honorific" AS ENUM('dr', 'prof', 'mr', 'mrs', 'ms');
  CREATE TYPE "payload"."enum_people_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__people_v_version_roles" AS ENUM('board', 'team', 'speaker', 'scientific-committee', 'planning-team', 'ecourse-author', 'moderator');
  CREATE TYPE "payload"."enum__people_v_version_honorific" AS ENUM('dr', 'prof', 'mr', 'mrs', 'ms');
  CREATE TYPE "payload"."enum__people_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__people_v_published_locale" AS ENUM('en', 'fr');
  CREATE TYPE "payload"."enum_member_organizations_membership_type" AS ENUM('member', 'affiliate');
  CREATE TYPE "payload"."enum_member_organizations_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__member_organizations_v_version_membership_type" AS ENUM('member', 'affiliate');
  CREATE TYPE "payload"."enum__member_organizations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__member_organizations_v_published_locale" AS ENUM('en', 'fr');
  CREATE TYPE "payload"."enum_partners_type" AS ENUM('strategic', 'collaborator', 'sponsor');
  CREATE TYPE "payload"."enum_partners_tier" AS ENUM('platinum', 'gold', 'silver', 'bronze', 'supporter');
  CREATE TYPE "payload"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "payload"."enum_main_menu_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__main_menu_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__main_menu_v_published_locale" AS ENUM('en', 'fr');
  CREATE TYPE "payload"."enum_footer_social_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'x', 'youtube', 'whatsapp');
  CREATE TYPE "payload"."enum_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__footer_v_version_social_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'x', 'youtube', 'whatsapp');
  CREATE TYPE "payload"."enum__footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__footer_v_published_locale" AS ENUM('en', 'fr');
  ALTER TYPE "payload"."enum_news_category" ADD VALUE 'blog';
  ALTER TYPE "payload"."enum_news_category" ADD VALUE 'story';
  ALTER TYPE "payload"."enum__news_v_version_category" ADD VALUE 'blog';
  ALTER TYPE "payload"."enum__news_v_version_category" ADD VALUE 'story';
  CREATE TABLE "payload"."events_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "payload"."events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "payload"."enum_events_type" DEFAULT 'other',
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"format" "payload"."enum_events_format",
  	"cover_id" integer,
  	"registration_url" varchar,
  	"slug" varchar,
  	"seo_image_id" integer,
  	"legacy_image_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."events_locales" (
  	"title" varchar,
  	"location" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"registration_label" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_events_v_version_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "payload"."enum__events_v_version_type" DEFAULT 'other',
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_format" "payload"."enum__events_v_version_format",
  	"version_cover_id" integer,
  	"version_registration_url" varchar,
  	"version_slug" varchar,
  	"version_seo_image_id" integer,
  	"version_legacy_image_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__events_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_events_v_locales" (
  	"version_title" varchar,
  	"version_location" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_registration_label" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."galleries_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "payload"."galleries_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."galleries_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "payload"."galleries_legacy_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"alt" varchar
  );
  
  CREATE TABLE "payload"."galleries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"event_id" integer,
  	"congress_id" integer,
  	"external_album_url" varchar,
  	"cover_id" integer,
  	"slug" varchar,
  	"legacy_cover_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_galleries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."galleries_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_galleries_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_galleries_v_version_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_galleries_v_version_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_galleries_v_version_legacy_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_galleries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_event_id" integer,
  	"version_congress_id" integer,
  	"version_external_album_url" varchar,
  	"version_cover_id" integer,
  	"version_slug" varchar,
  	"version_legacy_cover_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__galleries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__galleries_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_galleries_v_locales" (
  	"version_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."resources_topics" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "payload"."enum_resources_topics",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."resources_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "payload"."resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "payload"."enum_resources_type",
  	"source" "payload"."enum_resources_source" DEFAULT 'link',
  	"url" varchar,
  	"file_id" integer,
  	"thumbnail_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"legacy_image_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."resources_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_resources_v_version_topics" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "payload"."enum__resources_v_version_topics",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."_resources_v_version_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_type" "payload"."enum__resources_v_version_type",
  	"version_source" "payload"."enum__resources_v_version_source" DEFAULT 'link',
  	"version_url" varchar,
  	"version_file_id" integer,
  	"version_thumbnail_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_legacy_image_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__resources_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_resources_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."congress_editions_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"partner_id" integer,
  	"tier" "payload"."enum_congress_editions_sponsors_tier"
  );
  
  CREATE TABLE "payload"."congress_editions_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "payload"."congress_editions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"number" numeric,
  	"format" "payload"."enum_congress_editions_format",
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"venue" varchar,
  	"city" varchar,
  	"country" varchar,
  	"hero_image_id" integer,
  	"registration_url" varchar,
  	"program_url" varchar,
  	"slug" varchar,
  	"seo_image_id" integer,
  	"legacy_image_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_congress_editions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."congress_editions_locales" (
  	"title" varchar,
  	"theme" varchar,
  	"about" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."congress_editions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer
  );
  
  CREATE TABLE "payload"."_congress_editions_v_version_sponsors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"partner_id" integer,
  	"tier" "payload"."enum__congress_editions_v_version_sponsors_tier",
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_congress_editions_v_version_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_congress_editions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_year" numeric,
  	"version_number" numeric,
  	"version_format" "payload"."enum__congress_editions_v_version_format",
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_venue" varchar,
  	"version_city" varchar,
  	"version_country" varchar,
  	"version_hero_image_id" integer,
  	"version_registration_url" varchar,
  	"version_program_url" varchar,
  	"version_slug" varchar,
  	"version_seo_image_id" integer,
  	"version_legacy_image_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__congress_editions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__congress_editions_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_congress_editions_v_locales" (
  	"version_title" varchar,
  	"version_theme" varchar,
  	"version_about" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_congress_editions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"people_id" integer
  );
  
  CREATE TABLE "payload"."people_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "payload"."enum_people_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."people_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "payload"."people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"honorific" "payload"."enum_people_honorific",
  	"name" varchar,
  	"credentials" varchar,
  	"organization" varchar,
  	"country" varchar,
  	"region_id" integer,
  	"photo_id" integer,
  	"sort_order" numeric,
  	"slug" varchar,
  	"name_on_old_site" varchar,
  	"legacy_image_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_people_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."people_locales" (
  	"position" varchar,
  	"bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_people_v_version_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "payload"."enum__people_v_version_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."_people_v_version_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_people_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_honorific" "payload"."enum__people_v_version_honorific",
  	"version_name" varchar,
  	"version_credentials" varchar,
  	"version_organization" varchar,
  	"version_country" varchar,
  	"version_region_id" integer,
  	"version_photo_id" integer,
  	"version_sort_order" numeric,
  	"version_slug" varchar,
  	"version_name_on_old_site" varchar,
  	"version_legacy_image_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__people_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__people_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_people_v_locales" (
  	"version_position" varchar,
  	"version_bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."member_organizations_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "payload"."member_organizations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"membership_type" "payload"."enum_member_organizations_membership_type" DEFAULT 'member',
  	"country" varchar,
  	"region_id" integer,
  	"logo_id" integer,
  	"website" varchar,
  	"slug" varchar,
  	"legacy_image_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_member_organizations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."member_organizations_locales" (
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_member_organizations_v_version_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_member_organizations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_membership_type" "payload"."enum__member_organizations_v_version_membership_type" DEFAULT 'member',
  	"version_country" varchar,
  	"version_region_id" integer,
  	"version_logo_id" integer,
  	"version_website" varchar,
  	"version_slug" varchar,
  	"version_legacy_image_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__member_organizations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__member_organizations_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_member_organizations_v_locales" (
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."partners_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "payload"."enum_partners_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."partners_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tier" "payload"."enum_partners_tier",
  	"logo_id" integer,
  	"website" varchar,
  	"legacy_image_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."regions_legacy_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"order" numeric,
  	"slug" varchar,
  	"legacy_image_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."regions_locales" (
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"type" "payload"."enum_redirects_type" DEFAULT '301' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."main_menu_l5" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean
  );
  
  CREATE TABLE "payload"."main_menu_l5_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."main_menu_l4" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean
  );
  
  CREATE TABLE "payload"."main_menu_l4_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."main_menu_l3" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean
  );
  
  CREATE TABLE "payload"."main_menu_l3_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."main_menu_l2" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean
  );
  
  CREATE TABLE "payload"."main_menu_l2_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."main_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean
  );
  
  CREATE TABLE "payload"."main_menu_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."main_menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "payload"."enum_main_menu_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."_main_menu_l5_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_main_menu_l5_v_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_main_menu_l4_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_main_menu_l4_v_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_main_menu_l3_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_main_menu_l3_v_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_main_menu_l2_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_main_menu_l2_v_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_main_menu_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_main_menu_v_version_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_main_menu_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "payload"."enum__main_menu_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__main_menu_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "payload"."footer_columns_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."footer_columns_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."footer_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "payload"."enum_footer_social_platform",
  	"url" varchar
  );
  
  CREATE TABLE "payload"."footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "payload"."footer_legal_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"address" varchar,
  	"charity_number" varchar,
  	"_status" "payload"."enum_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."footer_locales" (
  	"copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_footer_v_version_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_footer_v_version_columns_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_footer_v_version_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_footer_v_version_columns_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_footer_v_version_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "payload"."enum__footer_v_version_social_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_footer_v_version_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_footer_v_version_legal_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_email" varchar,
  	"version_address" varchar,
  	"version_charity_number" varchar,
  	"version__status" "payload"."enum__footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__footer_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."_footer_v_locales" (
  	"version_copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload"."news" ADD COLUMN "legacy_image_url" varchar;
  ALTER TABLE "payload"."_news_v" ADD COLUMN "version_legacy_image_url" varchar;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "galleries_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "congress_editions_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "people_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "member_organizations_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "regions_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "payload"."events_legacy_urls" ADD CONSTRAINT "events_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."events" ADD CONSTRAINT "events_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."events" ADD CONSTRAINT "events_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_events_v_version_legacy_urls" ADD CONSTRAINT "_events_v_version_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v" ADD CONSTRAINT "_events_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."galleries_images" ADD CONSTRAINT "galleries_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."galleries_images" ADD CONSTRAINT "galleries_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."galleries_images_locales" ADD CONSTRAINT "galleries_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."galleries_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."galleries_legacy_urls" ADD CONSTRAINT "galleries_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."galleries_legacy_images" ADD CONSTRAINT "galleries_legacy_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."galleries" ADD CONSTRAINT "galleries_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."galleries" ADD CONSTRAINT "galleries_congress_id_congress_editions_id_fk" FOREIGN KEY ("congress_id") REFERENCES "payload"."congress_editions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."galleries" ADD CONSTRAINT "galleries_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."galleries_locales" ADD CONSTRAINT "galleries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_galleries_v_version_images" ADD CONSTRAINT "_galleries_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_galleries_v_version_images" ADD CONSTRAINT "_galleries_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_galleries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_galleries_v_version_images_locales" ADD CONSTRAINT "_galleries_v_version_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_galleries_v_version_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_galleries_v_version_legacy_urls" ADD CONSTRAINT "_galleries_v_version_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_galleries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_galleries_v_version_legacy_images" ADD CONSTRAINT "_galleries_v_version_legacy_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_galleries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_galleries_v" ADD CONSTRAINT "_galleries_v_parent_id_galleries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."galleries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_galleries_v" ADD CONSTRAINT "_galleries_v_version_event_id_events_id_fk" FOREIGN KEY ("version_event_id") REFERENCES "payload"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_galleries_v" ADD CONSTRAINT "_galleries_v_version_congress_id_congress_editions_id_fk" FOREIGN KEY ("version_congress_id") REFERENCES "payload"."congress_editions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_galleries_v" ADD CONSTRAINT "_galleries_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_galleries_v_locales" ADD CONSTRAINT "_galleries_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_galleries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."resources_topics" ADD CONSTRAINT "resources_topics_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."resources_legacy_urls" ADD CONSTRAINT "resources_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."resources" ADD CONSTRAINT "resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."resources" ADD CONSTRAINT "resources_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."resources_locales" ADD CONSTRAINT "resources_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_resources_v_version_topics" ADD CONSTRAINT "_resources_v_version_topics_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_resources_v_version_legacy_urls" ADD CONSTRAINT "_resources_v_version_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_resources_v" ADD CONSTRAINT "_resources_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_resources_v" ADD CONSTRAINT "_resources_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_resources_v_locales" ADD CONSTRAINT "_resources_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."congress_editions_sponsors" ADD CONSTRAINT "congress_editions_sponsors_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "payload"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."congress_editions_sponsors" ADD CONSTRAINT "congress_editions_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."congress_editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."congress_editions_legacy_urls" ADD CONSTRAINT "congress_editions_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."congress_editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."congress_editions" ADD CONSTRAINT "congress_editions_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."congress_editions" ADD CONSTRAINT "congress_editions_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."congress_editions_locales" ADD CONSTRAINT "congress_editions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."congress_editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."congress_editions_rels" ADD CONSTRAINT "congress_editions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."congress_editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."congress_editions_rels" ADD CONSTRAINT "congress_editions_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "payload"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_congress_editions_v_version_sponsors" ADD CONSTRAINT "_congress_editions_v_version_sponsors_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "payload"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_congress_editions_v_version_sponsors" ADD CONSTRAINT "_congress_editions_v_version_sponsors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_congress_editions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_congress_editions_v_version_legacy_urls" ADD CONSTRAINT "_congress_editions_v_version_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_congress_editions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_congress_editions_v" ADD CONSTRAINT "_congress_editions_v_parent_id_congress_editions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."congress_editions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_congress_editions_v" ADD CONSTRAINT "_congress_editions_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_congress_editions_v" ADD CONSTRAINT "_congress_editions_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_congress_editions_v_locales" ADD CONSTRAINT "_congress_editions_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_congress_editions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_congress_editions_v_rels" ADD CONSTRAINT "_congress_editions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_congress_editions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_congress_editions_v_rels" ADD CONSTRAINT "_congress_editions_v_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "payload"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."people_roles" ADD CONSTRAINT "people_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."people_legacy_urls" ADD CONSTRAINT "people_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."people" ADD CONSTRAINT "people_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "payload"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."people_locales" ADD CONSTRAINT "people_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_people_v_version_roles" ADD CONSTRAINT "_people_v_version_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_people_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_people_v_version_legacy_urls" ADD CONSTRAINT "_people_v_version_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_people_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_people_v" ADD CONSTRAINT "_people_v_parent_id_people_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."people"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_people_v" ADD CONSTRAINT "_people_v_version_region_id_regions_id_fk" FOREIGN KEY ("version_region_id") REFERENCES "payload"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_people_v" ADD CONSTRAINT "_people_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_people_v_locales" ADD CONSTRAINT "_people_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_people_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."member_organizations_legacy_urls" ADD CONSTRAINT "member_organizations_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."member_organizations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."member_organizations" ADD CONSTRAINT "member_organizations_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "payload"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."member_organizations" ADD CONSTRAINT "member_organizations_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."member_organizations_locales" ADD CONSTRAINT "member_organizations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."member_organizations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_member_organizations_v_version_legacy_urls" ADD CONSTRAINT "_member_organizations_v_version_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_member_organizations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_member_organizations_v" ADD CONSTRAINT "_member_organizations_v_parent_id_member_organizations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."member_organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_member_organizations_v" ADD CONSTRAINT "_member_organizations_v_version_region_id_regions_id_fk" FOREIGN KEY ("version_region_id") REFERENCES "payload"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_member_organizations_v" ADD CONSTRAINT "_member_organizations_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_member_organizations_v_locales" ADD CONSTRAINT "_member_organizations_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_member_organizations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."partners_type" ADD CONSTRAINT "partners_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."partners_legacy_urls" ADD CONSTRAINT "partners_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."regions_legacy_urls" ADD CONSTRAINT "regions_legacy_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."regions_locales" ADD CONSTRAINT "regions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."main_menu_l5" ADD CONSTRAINT "main_menu_l5_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."main_menu_l4"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."main_menu_l5_locales" ADD CONSTRAINT "main_menu_l5_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."main_menu_l5"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."main_menu_l4" ADD CONSTRAINT "main_menu_l4_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."main_menu_l3"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."main_menu_l4_locales" ADD CONSTRAINT "main_menu_l4_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."main_menu_l4"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."main_menu_l3" ADD CONSTRAINT "main_menu_l3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."main_menu_l2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."main_menu_l3_locales" ADD CONSTRAINT "main_menu_l3_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."main_menu_l3"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."main_menu_l2" ADD CONSTRAINT "main_menu_l2_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."main_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."main_menu_l2_locales" ADD CONSTRAINT "main_menu_l2_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."main_menu_l2"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."main_menu_items" ADD CONSTRAINT "main_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."main_menu_items_locales" ADD CONSTRAINT "main_menu_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."main_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_main_menu_l5_v" ADD CONSTRAINT "_main_menu_l5_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_main_menu_l4_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_main_menu_l5_v_locales" ADD CONSTRAINT "_main_menu_l5_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_main_menu_l5_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_main_menu_l4_v" ADD CONSTRAINT "_main_menu_l4_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_main_menu_l3_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_main_menu_l4_v_locales" ADD CONSTRAINT "_main_menu_l4_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_main_menu_l4_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_main_menu_l3_v" ADD CONSTRAINT "_main_menu_l3_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_main_menu_l2_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_main_menu_l3_v_locales" ADD CONSTRAINT "_main_menu_l3_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_main_menu_l3_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_main_menu_l2_v" ADD CONSTRAINT "_main_menu_l2_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_main_menu_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_main_menu_l2_v_locales" ADD CONSTRAINT "_main_menu_l2_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_main_menu_l2_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_main_menu_v_version_items" ADD CONSTRAINT "_main_menu_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_main_menu_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_main_menu_v_version_items_locales" ADD CONSTRAINT "_main_menu_v_version_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_main_menu_v_version_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."footer_social" ADD CONSTRAINT "footer_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."footer_legal_links_locales" ADD CONSTRAINT "footer_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."footer_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_footer_v_version_columns_links" ADD CONSTRAINT "_footer_v_version_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_footer_v_version_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_footer_v_version_columns_links_locales" ADD CONSTRAINT "_footer_v_version_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_footer_v_version_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_footer_v_version_columns" ADD CONSTRAINT "_footer_v_version_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_footer_v_version_columns_locales" ADD CONSTRAINT "_footer_v_version_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_footer_v_version_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_footer_v_version_social" ADD CONSTRAINT "_footer_v_version_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_footer_v_version_legal_links" ADD CONSTRAINT "_footer_v_version_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_footer_v_version_legal_links_locales" ADD CONSTRAINT "_footer_v_version_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_footer_v_version_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_footer_v_locales" ADD CONSTRAINT "_footer_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_legacy_urls_order_idx" ON "payload"."events_legacy_urls" USING btree ("_order");
  CREATE INDEX "events_legacy_urls_parent_id_idx" ON "payload"."events_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "events_cover_idx" ON "payload"."events" USING btree ("cover_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "payload"."events" USING btree ("slug");
  CREATE INDEX "events_seo_seo_image_idx" ON "payload"."events" USING btree ("seo_image_id");
  CREATE INDEX "events_updated_at_idx" ON "payload"."events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "payload"."events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "payload"."events" USING btree ("_status");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "payload"."events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_locales_parent_id_idx" ON "payload"."events_locales" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_legacy_urls_order_idx" ON "payload"."_events_v_version_legacy_urls" USING btree ("_order");
  CREATE INDEX "_events_v_version_legacy_urls_parent_id_idx" ON "payload"."_events_v_version_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "payload"."_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_cover_idx" ON "payload"."_events_v" USING btree ("version_cover_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "payload"."_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_seo_version_seo_image_idx" ON "payload"."_events_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "payload"."_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "payload"."_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "payload"."_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "payload"."_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "payload"."_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "payload"."_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "payload"."_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "payload"."_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "payload"."_events_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "payload"."_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_locales_parent_id_idx" ON "payload"."_events_v_locales" USING btree ("_parent_id");
  CREATE INDEX "galleries_images_order_idx" ON "payload"."galleries_images" USING btree ("_order");
  CREATE INDEX "galleries_images_parent_id_idx" ON "payload"."galleries_images" USING btree ("_parent_id");
  CREATE INDEX "galleries_images_image_idx" ON "payload"."galleries_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "galleries_images_locales_locale_parent_id_unique" ON "payload"."galleries_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "galleries_images_locales_parent_id_idx" ON "payload"."galleries_images_locales" USING btree ("_parent_id");
  CREATE INDEX "galleries_legacy_urls_order_idx" ON "payload"."galleries_legacy_urls" USING btree ("_order");
  CREATE INDEX "galleries_legacy_urls_parent_id_idx" ON "payload"."galleries_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "galleries_legacy_images_order_idx" ON "payload"."galleries_legacy_images" USING btree ("_order");
  CREATE INDEX "galleries_legacy_images_parent_id_idx" ON "payload"."galleries_legacy_images" USING btree ("_parent_id");
  CREATE INDEX "galleries_event_idx" ON "payload"."galleries" USING btree ("event_id");
  CREATE INDEX "galleries_congress_idx" ON "payload"."galleries" USING btree ("congress_id");
  CREATE INDEX "galleries_cover_idx" ON "payload"."galleries" USING btree ("cover_id");
  CREATE UNIQUE INDEX "galleries_slug_idx" ON "payload"."galleries" USING btree ("slug");
  CREATE INDEX "galleries_updated_at_idx" ON "payload"."galleries" USING btree ("updated_at");
  CREATE INDEX "galleries_created_at_idx" ON "payload"."galleries" USING btree ("created_at");
  CREATE INDEX "galleries__status_idx" ON "payload"."galleries" USING btree ("_status");
  CREATE UNIQUE INDEX "galleries_locales_locale_parent_id_unique" ON "payload"."galleries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "galleries_locales_parent_id_idx" ON "payload"."galleries_locales" USING btree ("_parent_id");
  CREATE INDEX "_galleries_v_version_images_order_idx" ON "payload"."_galleries_v_version_images" USING btree ("_order");
  CREATE INDEX "_galleries_v_version_images_parent_id_idx" ON "payload"."_galleries_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_galleries_v_version_images_image_idx" ON "payload"."_galleries_v_version_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "_galleries_v_version_images_locales_locale_parent_id_unique" ON "payload"."_galleries_v_version_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_galleries_v_version_images_locales_parent_id_idx" ON "payload"."_galleries_v_version_images_locales" USING btree ("_parent_id");
  CREATE INDEX "_galleries_v_version_legacy_urls_order_idx" ON "payload"."_galleries_v_version_legacy_urls" USING btree ("_order");
  CREATE INDEX "_galleries_v_version_legacy_urls_parent_id_idx" ON "payload"."_galleries_v_version_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "_galleries_v_version_legacy_images_order_idx" ON "payload"."_galleries_v_version_legacy_images" USING btree ("_order");
  CREATE INDEX "_galleries_v_version_legacy_images_parent_id_idx" ON "payload"."_galleries_v_version_legacy_images" USING btree ("_parent_id");
  CREATE INDEX "_galleries_v_parent_idx" ON "payload"."_galleries_v" USING btree ("parent_id");
  CREATE INDEX "_galleries_v_version_version_event_idx" ON "payload"."_galleries_v" USING btree ("version_event_id");
  CREATE INDEX "_galleries_v_version_version_congress_idx" ON "payload"."_galleries_v" USING btree ("version_congress_id");
  CREATE INDEX "_galleries_v_version_version_cover_idx" ON "payload"."_galleries_v" USING btree ("version_cover_id");
  CREATE INDEX "_galleries_v_version_version_slug_idx" ON "payload"."_galleries_v" USING btree ("version_slug");
  CREATE INDEX "_galleries_v_version_version_updated_at_idx" ON "payload"."_galleries_v" USING btree ("version_updated_at");
  CREATE INDEX "_galleries_v_version_version_created_at_idx" ON "payload"."_galleries_v" USING btree ("version_created_at");
  CREATE INDEX "_galleries_v_version_version__status_idx" ON "payload"."_galleries_v" USING btree ("version__status");
  CREATE INDEX "_galleries_v_created_at_idx" ON "payload"."_galleries_v" USING btree ("created_at");
  CREATE INDEX "_galleries_v_updated_at_idx" ON "payload"."_galleries_v" USING btree ("updated_at");
  CREATE INDEX "_galleries_v_snapshot_idx" ON "payload"."_galleries_v" USING btree ("snapshot");
  CREATE INDEX "_galleries_v_published_locale_idx" ON "payload"."_galleries_v" USING btree ("published_locale");
  CREATE INDEX "_galleries_v_latest_idx" ON "payload"."_galleries_v" USING btree ("latest");
  CREATE INDEX "_galleries_v_autosave_idx" ON "payload"."_galleries_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_galleries_v_locales_locale_parent_id_unique" ON "payload"."_galleries_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_galleries_v_locales_parent_id_idx" ON "payload"."_galleries_v_locales" USING btree ("_parent_id");
  CREATE INDEX "resources_topics_order_idx" ON "payload"."resources_topics" USING btree ("order");
  CREATE INDEX "resources_topics_parent_idx" ON "payload"."resources_topics" USING btree ("parent_id");
  CREATE INDEX "resources_legacy_urls_order_idx" ON "payload"."resources_legacy_urls" USING btree ("_order");
  CREATE INDEX "resources_legacy_urls_parent_id_idx" ON "payload"."resources_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "resources_file_idx" ON "payload"."resources" USING btree ("file_id");
  CREATE INDEX "resources_thumbnail_idx" ON "payload"."resources" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "payload"."resources" USING btree ("slug");
  CREATE INDEX "resources_updated_at_idx" ON "payload"."resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "payload"."resources" USING btree ("created_at");
  CREATE INDEX "resources__status_idx" ON "payload"."resources" USING btree ("_status");
  CREATE UNIQUE INDEX "resources_locales_locale_parent_id_unique" ON "payload"."resources_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "resources_locales_parent_id_idx" ON "payload"."resources_locales" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_version_topics_order_idx" ON "payload"."_resources_v_version_topics" USING btree ("order");
  CREATE INDEX "_resources_v_version_topics_parent_idx" ON "payload"."_resources_v_version_topics" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_legacy_urls_order_idx" ON "payload"."_resources_v_version_legacy_urls" USING btree ("_order");
  CREATE INDEX "_resources_v_version_legacy_urls_parent_id_idx" ON "payload"."_resources_v_version_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_parent_idx" ON "payload"."_resources_v" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_version_file_idx" ON "payload"."_resources_v" USING btree ("version_file_id");
  CREATE INDEX "_resources_v_version_version_thumbnail_idx" ON "payload"."_resources_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_resources_v_version_version_slug_idx" ON "payload"."_resources_v" USING btree ("version_slug");
  CREATE INDEX "_resources_v_version_version_updated_at_idx" ON "payload"."_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_resources_v_version_version_created_at_idx" ON "payload"."_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_resources_v_version_version__status_idx" ON "payload"."_resources_v" USING btree ("version__status");
  CREATE INDEX "_resources_v_created_at_idx" ON "payload"."_resources_v" USING btree ("created_at");
  CREATE INDEX "_resources_v_updated_at_idx" ON "payload"."_resources_v" USING btree ("updated_at");
  CREATE INDEX "_resources_v_snapshot_idx" ON "payload"."_resources_v" USING btree ("snapshot");
  CREATE INDEX "_resources_v_published_locale_idx" ON "payload"."_resources_v" USING btree ("published_locale");
  CREATE INDEX "_resources_v_latest_idx" ON "payload"."_resources_v" USING btree ("latest");
  CREATE INDEX "_resources_v_autosave_idx" ON "payload"."_resources_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_resources_v_locales_locale_parent_id_unique" ON "payload"."_resources_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_resources_v_locales_parent_id_idx" ON "payload"."_resources_v_locales" USING btree ("_parent_id");
  CREATE INDEX "congress_editions_sponsors_order_idx" ON "payload"."congress_editions_sponsors" USING btree ("_order");
  CREATE INDEX "congress_editions_sponsors_parent_id_idx" ON "payload"."congress_editions_sponsors" USING btree ("_parent_id");
  CREATE INDEX "congress_editions_sponsors_partner_idx" ON "payload"."congress_editions_sponsors" USING btree ("partner_id");
  CREATE INDEX "congress_editions_legacy_urls_order_idx" ON "payload"."congress_editions_legacy_urls" USING btree ("_order");
  CREATE INDEX "congress_editions_legacy_urls_parent_id_idx" ON "payload"."congress_editions_legacy_urls" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "congress_editions_year_idx" ON "payload"."congress_editions" USING btree ("year");
  CREATE INDEX "congress_editions_hero_image_idx" ON "payload"."congress_editions" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "congress_editions_slug_idx" ON "payload"."congress_editions" USING btree ("slug");
  CREATE INDEX "congress_editions_seo_seo_image_idx" ON "payload"."congress_editions" USING btree ("seo_image_id");
  CREATE INDEX "congress_editions_updated_at_idx" ON "payload"."congress_editions" USING btree ("updated_at");
  CREATE INDEX "congress_editions_created_at_idx" ON "payload"."congress_editions" USING btree ("created_at");
  CREATE INDEX "congress_editions__status_idx" ON "payload"."congress_editions" USING btree ("_status");
  CREATE UNIQUE INDEX "congress_editions_locales_locale_parent_id_unique" ON "payload"."congress_editions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "congress_editions_locales_parent_id_idx" ON "payload"."congress_editions_locales" USING btree ("_parent_id");
  CREATE INDEX "congress_editions_rels_order_idx" ON "payload"."congress_editions_rels" USING btree ("order");
  CREATE INDEX "congress_editions_rels_parent_idx" ON "payload"."congress_editions_rels" USING btree ("parent_id");
  CREATE INDEX "congress_editions_rels_path_idx" ON "payload"."congress_editions_rels" USING btree ("path");
  CREATE INDEX "congress_editions_rels_people_id_idx" ON "payload"."congress_editions_rels" USING btree ("people_id");
  CREATE INDEX "_congress_editions_v_version_sponsors_order_idx" ON "payload"."_congress_editions_v_version_sponsors" USING btree ("_order");
  CREATE INDEX "_congress_editions_v_version_sponsors_parent_id_idx" ON "payload"."_congress_editions_v_version_sponsors" USING btree ("_parent_id");
  CREATE INDEX "_congress_editions_v_version_sponsors_partner_idx" ON "payload"."_congress_editions_v_version_sponsors" USING btree ("partner_id");
  CREATE INDEX "_congress_editions_v_version_legacy_urls_order_idx" ON "payload"."_congress_editions_v_version_legacy_urls" USING btree ("_order");
  CREATE INDEX "_congress_editions_v_version_legacy_urls_parent_id_idx" ON "payload"."_congress_editions_v_version_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "_congress_editions_v_parent_idx" ON "payload"."_congress_editions_v" USING btree ("parent_id");
  CREATE INDEX "_congress_editions_v_version_version_year_idx" ON "payload"."_congress_editions_v" USING btree ("version_year");
  CREATE INDEX "_congress_editions_v_version_version_hero_image_idx" ON "payload"."_congress_editions_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_congress_editions_v_version_version_slug_idx" ON "payload"."_congress_editions_v" USING btree ("version_slug");
  CREATE INDEX "_congress_editions_v_version_seo_version_seo_image_idx" ON "payload"."_congress_editions_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_congress_editions_v_version_version_updated_at_idx" ON "payload"."_congress_editions_v" USING btree ("version_updated_at");
  CREATE INDEX "_congress_editions_v_version_version_created_at_idx" ON "payload"."_congress_editions_v" USING btree ("version_created_at");
  CREATE INDEX "_congress_editions_v_version_version__status_idx" ON "payload"."_congress_editions_v" USING btree ("version__status");
  CREATE INDEX "_congress_editions_v_created_at_idx" ON "payload"."_congress_editions_v" USING btree ("created_at");
  CREATE INDEX "_congress_editions_v_updated_at_idx" ON "payload"."_congress_editions_v" USING btree ("updated_at");
  CREATE INDEX "_congress_editions_v_snapshot_idx" ON "payload"."_congress_editions_v" USING btree ("snapshot");
  CREATE INDEX "_congress_editions_v_published_locale_idx" ON "payload"."_congress_editions_v" USING btree ("published_locale");
  CREATE INDEX "_congress_editions_v_latest_idx" ON "payload"."_congress_editions_v" USING btree ("latest");
  CREATE INDEX "_congress_editions_v_autosave_idx" ON "payload"."_congress_editions_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_congress_editions_v_locales_locale_parent_id_unique" ON "payload"."_congress_editions_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_congress_editions_v_locales_parent_id_idx" ON "payload"."_congress_editions_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_congress_editions_v_rels_order_idx" ON "payload"."_congress_editions_v_rels" USING btree ("order");
  CREATE INDEX "_congress_editions_v_rels_parent_idx" ON "payload"."_congress_editions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_congress_editions_v_rels_path_idx" ON "payload"."_congress_editions_v_rels" USING btree ("path");
  CREATE INDEX "_congress_editions_v_rels_people_id_idx" ON "payload"."_congress_editions_v_rels" USING btree ("people_id");
  CREATE INDEX "people_roles_order_idx" ON "payload"."people_roles" USING btree ("order");
  CREATE INDEX "people_roles_parent_idx" ON "payload"."people_roles" USING btree ("parent_id");
  CREATE INDEX "people_legacy_urls_order_idx" ON "payload"."people_legacy_urls" USING btree ("_order");
  CREATE INDEX "people_legacy_urls_parent_id_idx" ON "payload"."people_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "people_region_idx" ON "payload"."people" USING btree ("region_id");
  CREATE INDEX "people_photo_idx" ON "payload"."people" USING btree ("photo_id");
  CREATE UNIQUE INDEX "people_slug_idx" ON "payload"."people" USING btree ("slug");
  CREATE INDEX "people_updated_at_idx" ON "payload"."people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "payload"."people" USING btree ("created_at");
  CREATE INDEX "people__status_idx" ON "payload"."people" USING btree ("_status");
  CREATE UNIQUE INDEX "people_locales_locale_parent_id_unique" ON "payload"."people_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "people_locales_parent_id_idx" ON "payload"."people_locales" USING btree ("_parent_id");
  CREATE INDEX "_people_v_version_roles_order_idx" ON "payload"."_people_v_version_roles" USING btree ("order");
  CREATE INDEX "_people_v_version_roles_parent_idx" ON "payload"."_people_v_version_roles" USING btree ("parent_id");
  CREATE INDEX "_people_v_version_legacy_urls_order_idx" ON "payload"."_people_v_version_legacy_urls" USING btree ("_order");
  CREATE INDEX "_people_v_version_legacy_urls_parent_id_idx" ON "payload"."_people_v_version_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "_people_v_parent_idx" ON "payload"."_people_v" USING btree ("parent_id");
  CREATE INDEX "_people_v_version_version_region_idx" ON "payload"."_people_v" USING btree ("version_region_id");
  CREATE INDEX "_people_v_version_version_photo_idx" ON "payload"."_people_v" USING btree ("version_photo_id");
  CREATE INDEX "_people_v_version_version_slug_idx" ON "payload"."_people_v" USING btree ("version_slug");
  CREATE INDEX "_people_v_version_version_updated_at_idx" ON "payload"."_people_v" USING btree ("version_updated_at");
  CREATE INDEX "_people_v_version_version_created_at_idx" ON "payload"."_people_v" USING btree ("version_created_at");
  CREATE INDEX "_people_v_version_version__status_idx" ON "payload"."_people_v" USING btree ("version__status");
  CREATE INDEX "_people_v_created_at_idx" ON "payload"."_people_v" USING btree ("created_at");
  CREATE INDEX "_people_v_updated_at_idx" ON "payload"."_people_v" USING btree ("updated_at");
  CREATE INDEX "_people_v_snapshot_idx" ON "payload"."_people_v" USING btree ("snapshot");
  CREATE INDEX "_people_v_published_locale_idx" ON "payload"."_people_v" USING btree ("published_locale");
  CREATE INDEX "_people_v_latest_idx" ON "payload"."_people_v" USING btree ("latest");
  CREATE INDEX "_people_v_autosave_idx" ON "payload"."_people_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_people_v_locales_locale_parent_id_unique" ON "payload"."_people_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_people_v_locales_parent_id_idx" ON "payload"."_people_v_locales" USING btree ("_parent_id");
  CREATE INDEX "member_organizations_legacy_urls_order_idx" ON "payload"."member_organizations_legacy_urls" USING btree ("_order");
  CREATE INDEX "member_organizations_legacy_urls_parent_id_idx" ON "payload"."member_organizations_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "member_organizations_region_idx" ON "payload"."member_organizations" USING btree ("region_id");
  CREATE INDEX "member_organizations_logo_idx" ON "payload"."member_organizations" USING btree ("logo_id");
  CREATE UNIQUE INDEX "member_organizations_slug_idx" ON "payload"."member_organizations" USING btree ("slug");
  CREATE INDEX "member_organizations_updated_at_idx" ON "payload"."member_organizations" USING btree ("updated_at");
  CREATE INDEX "member_organizations_created_at_idx" ON "payload"."member_organizations" USING btree ("created_at");
  CREATE INDEX "member_organizations__status_idx" ON "payload"."member_organizations" USING btree ("_status");
  CREATE UNIQUE INDEX "member_organizations_locales_locale_parent_id_unique" ON "payload"."member_organizations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "member_organizations_locales_parent_id_idx" ON "payload"."member_organizations_locales" USING btree ("_parent_id");
  CREATE INDEX "_member_organizations_v_version_legacy_urls_order_idx" ON "payload"."_member_organizations_v_version_legacy_urls" USING btree ("_order");
  CREATE INDEX "_member_organizations_v_version_legacy_urls_parent_id_idx" ON "payload"."_member_organizations_v_version_legacy_urls" USING btree ("_parent_id");
  CREATE INDEX "_member_organizations_v_parent_idx" ON "payload"."_member_organizations_v" USING btree ("parent_id");
  CREATE INDEX "_member_organizations_v_version_version_region_idx" ON "payload"."_member_organizations_v" USING btree ("version_region_id");
  CREATE INDEX "_member_organizations_v_version_version_logo_idx" ON "payload"."_member_organizations_v" USING btree ("version_logo_id");
  CREATE INDEX "_member_organizations_v_version_version_slug_idx" ON "payload"."_member_organizations_v" USING btree ("version_slug");
  CREATE INDEX "_member_organizations_v_version_version_updated_at_idx" ON "payload"."_member_organizations_v" USING btree ("version_updated_at");
  CREATE INDEX "_member_organizations_v_version_version_created_at_idx" ON "payload"."_member_organizations_v" USING btree ("version_created_at");
  CREATE INDEX "_member_organizations_v_version_version__status_idx" ON "payload"."_member_organizations_v" USING btree ("version__status");
  CREATE INDEX "_member_organizations_v_created_at_idx" ON "payload"."_member_organizations_v" USING btree ("created_at");
  CREATE INDEX "_member_organizations_v_updated_at_idx" ON "payload"."_member_organizations_v" USING btree ("updated_at");
  CREATE INDEX "_member_organizations_v_snapshot_idx" ON "payload"."_member_organizations_v" USING btree ("snapshot");
  CREATE INDEX "_member_organizations_v_published_locale_idx" ON "payload"."_member_organizations_v" USING btree ("published_locale");
  CREATE INDEX "_member_organizations_v_latest_idx" ON "payload"."_member_organizations_v" USING btree ("latest");
  CREATE INDEX "_member_organizations_v_autosave_idx" ON "payload"."_member_organizations_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_member_organizations_v_locales_locale_parent_id_unique" ON "payload"."_member_organizations_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_member_organizations_v_locales_parent_id_idx" ON "payload"."_member_organizations_v_locales" USING btree ("_parent_id");
  CREATE INDEX "partners_type_order_idx" ON "payload"."partners_type" USING btree ("order");
  CREATE INDEX "partners_type_parent_idx" ON "payload"."partners_type" USING btree ("parent_id");
  CREATE INDEX "partners_legacy_urls_order_idx" ON "payload"."partners_legacy_urls" USING btree ("_order");
  CREATE INDEX "partners_legacy_urls_parent_id_idx" ON "payload"."partners_legacy_urls" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_name_idx" ON "payload"."partners" USING btree ("name");
  CREATE INDEX "partners_logo_idx" ON "payload"."partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "payload"."partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "payload"."partners" USING btree ("created_at");
  CREATE INDEX "regions_legacy_urls_order_idx" ON "payload"."regions_legacy_urls" USING btree ("_order");
  CREATE INDEX "regions_legacy_urls_parent_id_idx" ON "payload"."regions_legacy_urls" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "regions_code_idx" ON "payload"."regions" USING btree ("code");
  CREATE UNIQUE INDEX "regions_slug_idx" ON "payload"."regions" USING btree ("slug");
  CREATE INDEX "regions_updated_at_idx" ON "payload"."regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "payload"."regions" USING btree ("created_at");
  CREATE UNIQUE INDEX "regions_locales_locale_parent_id_unique" ON "payload"."regions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "regions_locales_parent_id_idx" ON "payload"."regions_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "payload"."redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "payload"."redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "payload"."redirects" USING btree ("created_at");
  CREATE INDEX "main_menu_l5_order_idx" ON "payload"."main_menu_l5" USING btree ("_order");
  CREATE INDEX "main_menu_l5_parent_id_idx" ON "payload"."main_menu_l5" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "main_menu_l5_locales_locale_parent_id_unique" ON "payload"."main_menu_l5_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_menu_l5_locales_parent_id_idx" ON "payload"."main_menu_l5_locales" USING btree ("_parent_id");
  CREATE INDEX "main_menu_l4_order_idx" ON "payload"."main_menu_l4" USING btree ("_order");
  CREATE INDEX "main_menu_l4_parent_id_idx" ON "payload"."main_menu_l4" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "main_menu_l4_locales_locale_parent_id_unique" ON "payload"."main_menu_l4_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_menu_l4_locales_parent_id_idx" ON "payload"."main_menu_l4_locales" USING btree ("_parent_id");
  CREATE INDEX "main_menu_l3_order_idx" ON "payload"."main_menu_l3" USING btree ("_order");
  CREATE INDEX "main_menu_l3_parent_id_idx" ON "payload"."main_menu_l3" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "main_menu_l3_locales_locale_parent_id_unique" ON "payload"."main_menu_l3_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_menu_l3_locales_parent_id_idx" ON "payload"."main_menu_l3_locales" USING btree ("_parent_id");
  CREATE INDEX "main_menu_l2_order_idx" ON "payload"."main_menu_l2" USING btree ("_order");
  CREATE INDEX "main_menu_l2_parent_id_idx" ON "payload"."main_menu_l2" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "main_menu_l2_locales_locale_parent_id_unique" ON "payload"."main_menu_l2_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_menu_l2_locales_parent_id_idx" ON "payload"."main_menu_l2_locales" USING btree ("_parent_id");
  CREATE INDEX "main_menu_items_order_idx" ON "payload"."main_menu_items" USING btree ("_order");
  CREATE INDEX "main_menu_items_parent_id_idx" ON "payload"."main_menu_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "main_menu_items_locales_locale_parent_id_unique" ON "payload"."main_menu_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "main_menu_items_locales_parent_id_idx" ON "payload"."main_menu_items_locales" USING btree ("_parent_id");
  CREATE INDEX "main_menu__status_idx" ON "payload"."main_menu" USING btree ("_status");
  CREATE INDEX "_main_menu_l5_v_order_idx" ON "payload"."_main_menu_l5_v" USING btree ("_order");
  CREATE INDEX "_main_menu_l5_v_parent_id_idx" ON "payload"."_main_menu_l5_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_main_menu_l5_v_locales_locale_parent_id_unique" ON "payload"."_main_menu_l5_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_menu_l5_v_locales_parent_id_idx" ON "payload"."_main_menu_l5_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_menu_l4_v_order_idx" ON "payload"."_main_menu_l4_v" USING btree ("_order");
  CREATE INDEX "_main_menu_l4_v_parent_id_idx" ON "payload"."_main_menu_l4_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_main_menu_l4_v_locales_locale_parent_id_unique" ON "payload"."_main_menu_l4_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_menu_l4_v_locales_parent_id_idx" ON "payload"."_main_menu_l4_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_menu_l3_v_order_idx" ON "payload"."_main_menu_l3_v" USING btree ("_order");
  CREATE INDEX "_main_menu_l3_v_parent_id_idx" ON "payload"."_main_menu_l3_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_main_menu_l3_v_locales_locale_parent_id_unique" ON "payload"."_main_menu_l3_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_menu_l3_v_locales_parent_id_idx" ON "payload"."_main_menu_l3_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_menu_l2_v_order_idx" ON "payload"."_main_menu_l2_v" USING btree ("_order");
  CREATE INDEX "_main_menu_l2_v_parent_id_idx" ON "payload"."_main_menu_l2_v" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_main_menu_l2_v_locales_locale_parent_id_unique" ON "payload"."_main_menu_l2_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_menu_l2_v_locales_parent_id_idx" ON "payload"."_main_menu_l2_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_menu_v_version_items_order_idx" ON "payload"."_main_menu_v_version_items" USING btree ("_order");
  CREATE INDEX "_main_menu_v_version_items_parent_id_idx" ON "payload"."_main_menu_v_version_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_main_menu_v_version_items_locales_locale_parent_id_unique" ON "payload"."_main_menu_v_version_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_main_menu_v_version_items_locales_parent_id_idx" ON "payload"."_main_menu_v_version_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_main_menu_v_version_version__status_idx" ON "payload"."_main_menu_v" USING btree ("version__status");
  CREATE INDEX "_main_menu_v_created_at_idx" ON "payload"."_main_menu_v" USING btree ("created_at");
  CREATE INDEX "_main_menu_v_updated_at_idx" ON "payload"."_main_menu_v" USING btree ("updated_at");
  CREATE INDEX "_main_menu_v_snapshot_idx" ON "payload"."_main_menu_v" USING btree ("snapshot");
  CREATE INDEX "_main_menu_v_published_locale_idx" ON "payload"."_main_menu_v" USING btree ("published_locale");
  CREATE INDEX "_main_menu_v_latest_idx" ON "payload"."_main_menu_v" USING btree ("latest");
  CREATE INDEX "footer_columns_links_order_idx" ON "payload"."footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "payload"."footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "payload"."footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_locales_parent_id_idx" ON "payload"."footer_columns_links_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "payload"."footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "payload"."footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "payload"."footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_locales_parent_id_idx" ON "payload"."footer_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "footer_social_order_idx" ON "payload"."footer_social" USING btree ("_order");
  CREATE INDEX "footer_social_parent_id_idx" ON "payload"."footer_social" USING btree ("_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "payload"."footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "payload"."footer_legal_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_legal_links_locales_locale_parent_id_unique" ON "payload"."footer_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_legal_links_locales_parent_id_idx" ON "payload"."footer_legal_links_locales" USING btree ("_parent_id");
  CREATE INDEX "footer__status_idx" ON "payload"."footer" USING btree ("_status");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "payload"."footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_locales_parent_id_idx" ON "payload"."footer_locales" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_columns_links_order_idx" ON "payload"."_footer_v_version_columns_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_columns_links_parent_id_idx" ON "payload"."_footer_v_version_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_columns_links_locales_locale_parent_id_uni" ON "payload"."_footer_v_version_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_columns_links_locales_parent_id_idx" ON "payload"."_footer_v_version_columns_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_columns_order_idx" ON "payload"."_footer_v_version_columns" USING btree ("_order");
  CREATE INDEX "_footer_v_version_columns_parent_id_idx" ON "payload"."_footer_v_version_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_columns_locales_locale_parent_id_unique" ON "payload"."_footer_v_version_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_columns_locales_parent_id_idx" ON "payload"."_footer_v_version_columns_locales" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_social_order_idx" ON "payload"."_footer_v_version_social" USING btree ("_order");
  CREATE INDEX "_footer_v_version_social_parent_id_idx" ON "payload"."_footer_v_version_social" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_legal_links_order_idx" ON "payload"."_footer_v_version_legal_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_legal_links_parent_id_idx" ON "payload"."_footer_v_version_legal_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_legal_links_locales_locale_parent_id_uniqu" ON "payload"."_footer_v_version_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_legal_links_locales_parent_id_idx" ON "payload"."_footer_v_version_legal_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_version__status_idx" ON "payload"."_footer_v" USING btree ("version__status");
  CREATE INDEX "_footer_v_created_at_idx" ON "payload"."_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "payload"."_footer_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_snapshot_idx" ON "payload"."_footer_v" USING btree ("snapshot");
  CREATE INDEX "_footer_v_published_locale_idx" ON "payload"."_footer_v" USING btree ("published_locale");
  CREATE INDEX "_footer_v_latest_idx" ON "payload"."_footer_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_footer_v_locales_locale_parent_id_unique" ON "payload"."_footer_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_locales_parent_id_idx" ON "payload"."_footer_v_locales" USING btree ("_parent_id");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "payload"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_galleries_fk" FOREIGN KEY ("galleries_id") REFERENCES "payload"."galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "payload"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_congress_editions_fk" FOREIGN KEY ("congress_editions_id") REFERENCES "payload"."congress_editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "payload"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_member_organizations_fk" FOREIGN KEY ("member_organizations_id") REFERENCES "payload"."member_organizations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "payload"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "payload"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "payload"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_galleries_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("galleries_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_congress_editions_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("congress_editions_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_member_organizations_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("member_organizations_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("regions_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("redirects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."events_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."events_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_events_v_version_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_events_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."galleries_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."galleries_images_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."galleries_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."galleries_legacy_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."galleries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."galleries_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_galleries_v_version_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_galleries_v_version_images_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_galleries_v_version_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_galleries_v_version_legacy_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_galleries_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_galleries_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."resources_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."resources_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."resources_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_resources_v_version_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_resources_v_version_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_resources_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_resources_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."congress_editions_sponsors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."congress_editions_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."congress_editions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."congress_editions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."congress_editions_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_congress_editions_v_version_sponsors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_congress_editions_v_version_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_congress_editions_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_congress_editions_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_congress_editions_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."people_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."people_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."people" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."people_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_people_v_version_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_people_v_version_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_people_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_people_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."member_organizations_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."member_organizations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."member_organizations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_member_organizations_v_version_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_member_organizations_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_member_organizations_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."partners_type" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."partners_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."regions_legacy_urls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."regions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."regions_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu_l5" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu_l5_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu_l4" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu_l4_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu_l3" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu_l3_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu_l2" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu_l2_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."main_menu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_l5_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_l5_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_l4_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_l4_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_l3_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_l3_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_l2_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_l2_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_v_version_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_v_version_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_main_menu_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."footer_columns_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."footer_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."footer_columns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."footer_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."footer_legal_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."footer_legal_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."footer_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_footer_v_version_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_footer_v_version_columns_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_footer_v_version_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_footer_v_version_columns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_footer_v_version_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_footer_v_version_legal_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_footer_v_version_legal_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_footer_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_footer_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."events_legacy_urls" CASCADE;
  DROP TABLE "payload"."events" CASCADE;
  DROP TABLE "payload"."events_locales" CASCADE;
  DROP TABLE "payload"."_events_v_version_legacy_urls" CASCADE;
  DROP TABLE "payload"."_events_v" CASCADE;
  DROP TABLE "payload"."_events_v_locales" CASCADE;
  DROP TABLE "payload"."galleries_images" CASCADE;
  DROP TABLE "payload"."galleries_images_locales" CASCADE;
  DROP TABLE "payload"."galleries_legacy_urls" CASCADE;
  DROP TABLE "payload"."galleries_legacy_images" CASCADE;
  DROP TABLE "payload"."galleries" CASCADE;
  DROP TABLE "payload"."galleries_locales" CASCADE;
  DROP TABLE "payload"."_galleries_v_version_images" CASCADE;
  DROP TABLE "payload"."_galleries_v_version_images_locales" CASCADE;
  DROP TABLE "payload"."_galleries_v_version_legacy_urls" CASCADE;
  DROP TABLE "payload"."_galleries_v_version_legacy_images" CASCADE;
  DROP TABLE "payload"."_galleries_v" CASCADE;
  DROP TABLE "payload"."_galleries_v_locales" CASCADE;
  DROP TABLE "payload"."resources_topics" CASCADE;
  DROP TABLE "payload"."resources_legacy_urls" CASCADE;
  DROP TABLE "payload"."resources" CASCADE;
  DROP TABLE "payload"."resources_locales" CASCADE;
  DROP TABLE "payload"."_resources_v_version_topics" CASCADE;
  DROP TABLE "payload"."_resources_v_version_legacy_urls" CASCADE;
  DROP TABLE "payload"."_resources_v" CASCADE;
  DROP TABLE "payload"."_resources_v_locales" CASCADE;
  DROP TABLE "payload"."congress_editions_sponsors" CASCADE;
  DROP TABLE "payload"."congress_editions_legacy_urls" CASCADE;
  DROP TABLE "payload"."congress_editions" CASCADE;
  DROP TABLE "payload"."congress_editions_locales" CASCADE;
  DROP TABLE "payload"."congress_editions_rels" CASCADE;
  DROP TABLE "payload"."_congress_editions_v_version_sponsors" CASCADE;
  DROP TABLE "payload"."_congress_editions_v_version_legacy_urls" CASCADE;
  DROP TABLE "payload"."_congress_editions_v" CASCADE;
  DROP TABLE "payload"."_congress_editions_v_locales" CASCADE;
  DROP TABLE "payload"."_congress_editions_v_rels" CASCADE;
  DROP TABLE "payload"."people_roles" CASCADE;
  DROP TABLE "payload"."people_legacy_urls" CASCADE;
  DROP TABLE "payload"."people" CASCADE;
  DROP TABLE "payload"."people_locales" CASCADE;
  DROP TABLE "payload"."_people_v_version_roles" CASCADE;
  DROP TABLE "payload"."_people_v_version_legacy_urls" CASCADE;
  DROP TABLE "payload"."_people_v" CASCADE;
  DROP TABLE "payload"."_people_v_locales" CASCADE;
  DROP TABLE "payload"."member_organizations_legacy_urls" CASCADE;
  DROP TABLE "payload"."member_organizations" CASCADE;
  DROP TABLE "payload"."member_organizations_locales" CASCADE;
  DROP TABLE "payload"."_member_organizations_v_version_legacy_urls" CASCADE;
  DROP TABLE "payload"."_member_organizations_v" CASCADE;
  DROP TABLE "payload"."_member_organizations_v_locales" CASCADE;
  DROP TABLE "payload"."partners_type" CASCADE;
  DROP TABLE "payload"."partners_legacy_urls" CASCADE;
  DROP TABLE "payload"."partners" CASCADE;
  DROP TABLE "payload"."regions_legacy_urls" CASCADE;
  DROP TABLE "payload"."regions" CASCADE;
  DROP TABLE "payload"."regions_locales" CASCADE;
  DROP TABLE "payload"."redirects" CASCADE;
  DROP TABLE "payload"."main_menu_l5" CASCADE;
  DROP TABLE "payload"."main_menu_l5_locales" CASCADE;
  DROP TABLE "payload"."main_menu_l4" CASCADE;
  DROP TABLE "payload"."main_menu_l4_locales" CASCADE;
  DROP TABLE "payload"."main_menu_l3" CASCADE;
  DROP TABLE "payload"."main_menu_l3_locales" CASCADE;
  DROP TABLE "payload"."main_menu_l2" CASCADE;
  DROP TABLE "payload"."main_menu_l2_locales" CASCADE;
  DROP TABLE "payload"."main_menu_items" CASCADE;
  DROP TABLE "payload"."main_menu_items_locales" CASCADE;
  DROP TABLE "payload"."main_menu" CASCADE;
  DROP TABLE "payload"."_main_menu_l5_v" CASCADE;
  DROP TABLE "payload"."_main_menu_l5_v_locales" CASCADE;
  DROP TABLE "payload"."_main_menu_l4_v" CASCADE;
  DROP TABLE "payload"."_main_menu_l4_v_locales" CASCADE;
  DROP TABLE "payload"."_main_menu_l3_v" CASCADE;
  DROP TABLE "payload"."_main_menu_l3_v_locales" CASCADE;
  DROP TABLE "payload"."_main_menu_l2_v" CASCADE;
  DROP TABLE "payload"."_main_menu_l2_v_locales" CASCADE;
  DROP TABLE "payload"."_main_menu_v_version_items" CASCADE;
  DROP TABLE "payload"."_main_menu_v_version_items_locales" CASCADE;
  DROP TABLE "payload"."_main_menu_v" CASCADE;
  DROP TABLE "payload"."footer_columns_links" CASCADE;
  DROP TABLE "payload"."footer_columns_links_locales" CASCADE;
  DROP TABLE "payload"."footer_columns" CASCADE;
  DROP TABLE "payload"."footer_columns_locales" CASCADE;
  DROP TABLE "payload"."footer_social" CASCADE;
  DROP TABLE "payload"."footer_legal_links" CASCADE;
  DROP TABLE "payload"."footer_legal_links_locales" CASCADE;
  DROP TABLE "payload"."footer" CASCADE;
  DROP TABLE "payload"."footer_locales" CASCADE;
  DROP TABLE "payload"."_footer_v_version_columns_links" CASCADE;
  DROP TABLE "payload"."_footer_v_version_columns_links_locales" CASCADE;
  DROP TABLE "payload"."_footer_v_version_columns" CASCADE;
  DROP TABLE "payload"."_footer_v_version_columns_locales" CASCADE;
  DROP TABLE "payload"."_footer_v_version_social" CASCADE;
  DROP TABLE "payload"."_footer_v_version_legal_links" CASCADE;
  DROP TABLE "payload"."_footer_v_version_legal_links_locales" CASCADE;
  DROP TABLE "payload"."_footer_v" CASCADE;
  DROP TABLE "payload"."_footer_v_locales" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_galleries_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_resources_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_congress_editions_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_people_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_member_organizations_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_partners_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_regions_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_redirects_fk";
  
  ALTER TABLE "payload"."news" ALTER COLUMN "category" SET DATA TYPE text;
  ALTER TABLE "payload"."news" ALTER COLUMN "category" SET DEFAULT 'news'::text;
  DROP TYPE "payload"."enum_news_category";
  CREATE TYPE "payload"."enum_news_category" AS ENUM('news', 'press-release', 'advocacy', 'research', 'congress', 'awareness');
  ALTER TABLE "payload"."news" ALTER COLUMN "category" SET DEFAULT 'news'::"payload"."enum_news_category";
  ALTER TABLE "payload"."news" ALTER COLUMN "category" SET DATA TYPE "payload"."enum_news_category" USING "category"::"payload"."enum_news_category";
  ALTER TABLE "payload"."_news_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  ALTER TABLE "payload"."_news_v" ALTER COLUMN "version_category" SET DEFAULT 'news'::text;
  DROP TYPE "payload"."enum__news_v_version_category";
  CREATE TYPE "payload"."enum__news_v_version_category" AS ENUM('news', 'press-release', 'advocacy', 'research', 'congress', 'awareness');
  ALTER TABLE "payload"."_news_v" ALTER COLUMN "version_category" SET DEFAULT 'news'::"payload"."enum__news_v_version_category";
  ALTER TABLE "payload"."_news_v" ALTER COLUMN "version_category" SET DATA TYPE "payload"."enum__news_v_version_category" USING "version_category"::"payload"."enum__news_v_version_category";
  DROP INDEX "payload"."payload_locked_documents_rels_events_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_galleries_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_resources_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_congress_editions_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_people_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_member_organizations_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_partners_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_regions_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_redirects_id_idx";
  ALTER TABLE "payload"."news" DROP COLUMN "legacy_image_url";
  ALTER TABLE "payload"."_news_v" DROP COLUMN "version_legacy_image_url";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "events_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "galleries_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "resources_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "congress_editions_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "people_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "member_organizations_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "partners_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "regions_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "redirects_id";
  DROP TYPE "payload"."enum_events_type";
  DROP TYPE "payload"."enum_events_format";
  DROP TYPE "payload"."enum_events_status";
  DROP TYPE "payload"."enum__events_v_version_type";
  DROP TYPE "payload"."enum__events_v_version_format";
  DROP TYPE "payload"."enum__events_v_version_status";
  DROP TYPE "payload"."enum__events_v_published_locale";
  DROP TYPE "payload"."enum_galleries_status";
  DROP TYPE "payload"."enum__galleries_v_version_status";
  DROP TYPE "payload"."enum__galleries_v_published_locale";
  DROP TYPE "payload"."enum_resources_topics";
  DROP TYPE "payload"."enum_resources_type";
  DROP TYPE "payload"."enum_resources_source";
  DROP TYPE "payload"."enum_resources_status";
  DROP TYPE "payload"."enum__resources_v_version_topics";
  DROP TYPE "payload"."enum__resources_v_version_type";
  DROP TYPE "payload"."enum__resources_v_version_source";
  DROP TYPE "payload"."enum__resources_v_version_status";
  DROP TYPE "payload"."enum__resources_v_published_locale";
  DROP TYPE "payload"."enum_congress_editions_sponsors_tier";
  DROP TYPE "payload"."enum_congress_editions_format";
  DROP TYPE "payload"."enum_congress_editions_status";
  DROP TYPE "payload"."enum__congress_editions_v_version_sponsors_tier";
  DROP TYPE "payload"."enum__congress_editions_v_version_format";
  DROP TYPE "payload"."enum__congress_editions_v_version_status";
  DROP TYPE "payload"."enum__congress_editions_v_published_locale";
  DROP TYPE "payload"."enum_people_roles";
  DROP TYPE "payload"."enum_people_honorific";
  DROP TYPE "payload"."enum_people_status";
  DROP TYPE "payload"."enum__people_v_version_roles";
  DROP TYPE "payload"."enum__people_v_version_honorific";
  DROP TYPE "payload"."enum__people_v_version_status";
  DROP TYPE "payload"."enum__people_v_published_locale";
  DROP TYPE "payload"."enum_member_organizations_membership_type";
  DROP TYPE "payload"."enum_member_organizations_status";
  DROP TYPE "payload"."enum__member_organizations_v_version_membership_type";
  DROP TYPE "payload"."enum__member_organizations_v_version_status";
  DROP TYPE "payload"."enum__member_organizations_v_published_locale";
  DROP TYPE "payload"."enum_partners_type";
  DROP TYPE "payload"."enum_partners_tier";
  DROP TYPE "payload"."enum_redirects_type";
  DROP TYPE "payload"."enum_main_menu_status";
  DROP TYPE "payload"."enum__main_menu_v_version_status";
  DROP TYPE "payload"."enum__main_menu_v_published_locale";
  DROP TYPE "payload"."enum_footer_social_platform";
  DROP TYPE "payload"."enum_footer_status";
  DROP TYPE "payload"."enum__footer_v_version_social_platform";
  DROP TYPE "payload"."enum__footer_v_version_status";
  DROP TYPE "payload"."enum__footer_v_published_locale";`)
}
