import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Website content lives in its own schema, separate from the Congress tables in the same database.
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS "payload"`);
  await db.execute(sql`
   CREATE TYPE "payload"."_locales" AS ENUM('en', 'fr');
  CREATE TYPE "payload"."enum_pages_blocks_media_text_image_side" AS ENUM('left', 'right');
  CREATE TYPE "payload"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__pages_v_blocks_media_text_image_side" AS ENUM('left', 'right');
  CREATE TYPE "payload"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__pages_v_published_locale" AS ENUM('en', 'fr');
  CREATE TYPE "payload"."enum_news_category" AS ENUM('news', 'press-release', 'advocacy', 'research', 'congress', 'awareness');
  CREATE TYPE "payload"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__news_v_version_category" AS ENUM('news', 'press-release', 'advocacy', 'research', 'congress', 'awareness');
  CREATE TYPE "payload"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__news_v_published_locale" AS ENUM('en', 'fr');
  CREATE TYPE "payload"."enum_users_roles" AS ENUM('super-admin', 'admin', 'editor', 'forms-manager');
  CREATE TYPE "payload"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "payload"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "payload"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "payload"."enum_announcement_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__announcement_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__announcement_v_published_locale" AS ENUM('en', 'fr');
  CREATE TABLE "payload"."pages_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_hero_actions_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_hero_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"lede" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."pages_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_text_locales" (
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."pages_blocks_media_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_side" "payload"."enum_pages_blocks_media_text_image_side" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_media_text_locales" (
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_cta_locales" (
  	"title" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."pages_locales" (
  	"title" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_hero_actions_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_hero_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"lede" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_text_locales" (
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_media_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_side" "payload"."enum__pages_v_blocks_media_text_image_side" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_media_text_locales" (
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_cta_locales" (
  	"title" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_pages_v_locales" (
  	"version_title" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"category" "payload"."enum_news_category" DEFAULT 'news',
  	"legacy_url" varchar,
  	"slug" varchar,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."news_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cover_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_category" "payload"."enum__news_v_version_category" DEFAULT 'news',
  	"version_legacy_url" varchar,
  	"version_slug" varchar,
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__news_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."_news_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "payload"."media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "payload"."enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"disabled" boolean DEFAULT false,
  	"supabase_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "payload"."enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "payload"."enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload"."payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "payload"."enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"news_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."announcement" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"href" varchar,
  	"_status" "payload"."enum_announcement_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."announcement_locales" (
  	"message" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_announcement_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT false,
  	"version_href" varchar,
  	"version__status" "payload"."enum__announcement_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "payload"."enum__announcement_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."_announcement_v_locales" (
  	"version_message" varchar,
  	"version_link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload"."pages_blocks_hero_actions" ADD CONSTRAINT "pages_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_hero_actions_locales" ADD CONSTRAINT "pages_blocks_hero_actions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_hero_actions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_text_locales" ADD CONSTRAINT "pages_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_media_text" ADD CONSTRAINT "pages_blocks_media_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_media_text" ADD CONSTRAINT "pages_blocks_media_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_media_text_locales" ADD CONSTRAINT "pages_blocks_media_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_media_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero_actions" ADD CONSTRAINT "_pages_v_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero_actions_locales" ADD CONSTRAINT "_pages_v_blocks_hero_actions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_hero_actions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero_locales" ADD CONSTRAINT "_pages_v_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_text" ADD CONSTRAINT "_pages_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_text_locales" ADD CONSTRAINT "_pages_v_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_media_text" ADD CONSTRAINT "_pages_v_blocks_media_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_media_text" ADD CONSTRAINT "_pages_v_blocks_media_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_media_text_locales" ADD CONSTRAINT "_pages_v_blocks_media_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_media_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_cta_locales" ADD CONSTRAINT "_pages_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."news" ADD CONSTRAINT "news_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."news" ADD CONSTRAINT "news_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_news_v" ADD CONSTRAINT "_news_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_news_v" ADD CONSTRAINT "_news_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_news_v_locales" ADD CONSTRAINT "_news_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "payload"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."announcement_locales" ADD CONSTRAINT "announcement_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."announcement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_announcement_v_locales" ADD CONSTRAINT "_announcement_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_announcement_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_actions_order_idx" ON "payload"."pages_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_actions_parent_id_idx" ON "payload"."pages_blocks_hero_actions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_actions_locales_locale_parent_id_unique" ON "payload"."pages_blocks_hero_actions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_actions_locales_parent_id_idx" ON "payload"."pages_blocks_hero_actions_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "payload"."pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "payload"."pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "payload"."pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "payload"."pages_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_locales_locale_parent_id_unique" ON "payload"."pages_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_locales_parent_id_idx" ON "payload"."pages_blocks_hero_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_order_idx" ON "payload"."pages_blocks_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_parent_id_idx" ON "payload"."pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_path_idx" ON "payload"."pages_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_text_locales_locale_parent_id_unique" ON "payload"."pages_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_text_locales_parent_id_idx" ON "payload"."pages_blocks_text_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_text_order_idx" ON "payload"."pages_blocks_media_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_text_parent_id_idx" ON "payload"."pages_blocks_media_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_text_path_idx" ON "payload"."pages_blocks_media_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_text_image_idx" ON "payload"."pages_blocks_media_text" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_media_text_locales_locale_parent_id_unique" ON "payload"."pages_blocks_media_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_media_text_locales_parent_id_idx" ON "payload"."pages_blocks_media_text_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "payload"."pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "payload"."pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "payload"."pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "payload"."pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_locales_parent_id_idx" ON "payload"."pages_blocks_cta_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "payload"."pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_image_idx" ON "payload"."pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "payload"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "payload"."pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "payload"."pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "payload"."pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "payload"."pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_actions_order_idx" ON "payload"."_pages_v_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_actions_parent_id_idx" ON "payload"."_pages_v_blocks_hero_actions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_actions_locales_locale_parent_id_unique" ON "payload"."_pages_v_blocks_hero_actions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_actions_locales_parent_id_idx" ON "payload"."_pages_v_blocks_hero_actions_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_locales_locale_parent_id_unique" ON "payload"."_pages_v_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_locales_parent_id_idx" ON "payload"."_pages_v_blocks_hero_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_order_idx" ON "payload"."_pages_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_text_parent_id_idx" ON "payload"."_pages_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_path_idx" ON "payload"."_pages_v_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_text_locales_locale_parent_id_unique" ON "payload"."_pages_v_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_text_locales_parent_id_idx" ON "payload"."_pages_v_blocks_text_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_text_order_idx" ON "payload"."_pages_v_blocks_media_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_text_parent_id_idx" ON "payload"."_pages_v_blocks_media_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_text_path_idx" ON "payload"."_pages_v_blocks_media_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_text_image_idx" ON "payload"."_pages_v_blocks_media_text" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_media_text_locales_locale_parent_id_unique" ON "payload"."_pages_v_blocks_media_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_media_text_locales_parent_id_idx" ON "payload"."_pages_v_blocks_media_text_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "payload"."_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "payload"."_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "payload"."_pages_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_locales_locale_parent_id_unique" ON "payload"."_pages_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_locales_parent_id_idx" ON "payload"."_pages_v_blocks_cta_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "payload"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "payload"."_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "payload"."_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "payload"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "payload"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "payload"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "payload"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "payload"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "payload"."_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "payload"."_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "payload"."_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "payload"."_pages_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "payload"."_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "payload"."_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "news_cover_idx" ON "payload"."news" USING btree ("cover_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "payload"."news" USING btree ("slug");
  CREATE INDEX "news_seo_seo_image_idx" ON "payload"."news" USING btree ("seo_image_id");
  CREATE INDEX "news_updated_at_idx" ON "payload"."news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "payload"."news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "payload"."news" USING btree ("_status");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "payload"."news_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "news_locales_parent_id_idx" ON "payload"."news_locales" USING btree ("_parent_id");
  CREATE INDEX "_news_v_parent_idx" ON "payload"."_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_cover_idx" ON "payload"."_news_v" USING btree ("version_cover_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "payload"."_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_seo_version_seo_image_idx" ON "payload"."_news_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "payload"."_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "payload"."_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "payload"."_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "payload"."_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "payload"."_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_snapshot_idx" ON "payload"."_news_v" USING btree ("snapshot");
  CREATE INDEX "_news_v_published_locale_idx" ON "payload"."_news_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_latest_idx" ON "payload"."_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "payload"."_news_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_news_v_locales_locale_parent_id_unique" ON "payload"."_news_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_news_v_locales_parent_id_idx" ON "payload"."_news_v_locales" USING btree ("_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "payload"."media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "payload"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "payload"."media" USING btree ("sizes_wide_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "payload"."media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "payload"."media_locales" USING btree ("_parent_id");
  CREATE INDEX "users_roles_order_idx" ON "payload"."users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "payload"."users_roles" USING btree ("parent_id");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE UNIQUE INDEX "users_supabase_id_idx" ON "payload"."users" USING btree ("supabase_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload"."payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload"."payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload"."payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload"."payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload"."payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload"."payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload"."payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload"."payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload"."payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload"."payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload"."payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "announcement__status_idx" ON "payload"."announcement" USING btree ("_status");
  CREATE UNIQUE INDEX "announcement_locales_locale_parent_id_unique" ON "payload"."announcement_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "announcement_locales_parent_id_idx" ON "payload"."announcement_locales" USING btree ("_parent_id");
  CREATE INDEX "_announcement_v_version_version__status_idx" ON "payload"."_announcement_v" USING btree ("version__status");
  CREATE INDEX "_announcement_v_created_at_idx" ON "payload"."_announcement_v" USING btree ("created_at");
  CREATE INDEX "_announcement_v_updated_at_idx" ON "payload"."_announcement_v" USING btree ("updated_at");
  CREATE INDEX "_announcement_v_snapshot_idx" ON "payload"."_announcement_v" USING btree ("snapshot");
  CREATE INDEX "_announcement_v_published_locale_idx" ON "payload"."_announcement_v" USING btree ("published_locale");
  CREATE INDEX "_announcement_v_latest_idx" ON "payload"."_announcement_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_announcement_v_locales_locale_parent_id_unique" ON "payload"."_announcement_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_announcement_v_locales_parent_id_idx" ON "payload"."_announcement_v_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."pages_blocks_hero_actions" CASCADE;
  DROP TABLE "payload"."pages_blocks_hero_actions_locales" CASCADE;
  DROP TABLE "payload"."pages_blocks_hero" CASCADE;
  DROP TABLE "payload"."pages_blocks_hero_locales" CASCADE;
  DROP TABLE "payload"."pages_blocks_text" CASCADE;
  DROP TABLE "payload"."pages_blocks_text_locales" CASCADE;
  DROP TABLE "payload"."pages_blocks_media_text" CASCADE;
  DROP TABLE "payload"."pages_blocks_media_text_locales" CASCADE;
  DROP TABLE "payload"."pages_blocks_cta" CASCADE;
  DROP TABLE "payload"."pages_blocks_cta_locales" CASCADE;
  DROP TABLE "payload"."pages" CASCADE;
  DROP TABLE "payload"."pages_locales" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_hero_actions" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_hero_actions_locales" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_hero" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_hero_locales" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_text" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_text_locales" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_media_text" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_media_text_locales" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_cta" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_cta_locales" CASCADE;
  DROP TABLE "payload"."_pages_v" CASCADE;
  DROP TABLE "payload"."_pages_v_locales" CASCADE;
  DROP TABLE "payload"."news" CASCADE;
  DROP TABLE "payload"."news_locales" CASCADE;
  DROP TABLE "payload"."_news_v" CASCADE;
  DROP TABLE "payload"."_news_v_locales" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."media_locales" CASCADE;
  DROP TABLE "payload"."users_roles" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_jobs_log" CASCADE;
  DROP TABLE "payload"."payload_jobs" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."announcement" CASCADE;
  DROP TABLE "payload"."announcement_locales" CASCADE;
  DROP TABLE "payload"."_announcement_v" CASCADE;
  DROP TABLE "payload"."_announcement_v_locales" CASCADE;
  DROP TYPE "payload"."_locales";
  DROP TYPE "payload"."enum_pages_blocks_media_text_image_side";
  DROP TYPE "payload"."enum_pages_status";
  DROP TYPE "payload"."enum__pages_v_blocks_media_text_image_side";
  DROP TYPE "payload"."enum__pages_v_version_status";
  DROP TYPE "payload"."enum__pages_v_published_locale";
  DROP TYPE "payload"."enum_news_category";
  DROP TYPE "payload"."enum_news_status";
  DROP TYPE "payload"."enum__news_v_version_category";
  DROP TYPE "payload"."enum__news_v_version_status";
  DROP TYPE "payload"."enum__news_v_published_locale";
  DROP TYPE "payload"."enum_users_roles";
  DROP TYPE "payload"."enum_payload_jobs_log_task_slug";
  DROP TYPE "payload"."enum_payload_jobs_log_state";
  DROP TYPE "payload"."enum_payload_jobs_task_slug";
  DROP TYPE "payload"."enum_announcement_status";
  DROP TYPE "payload"."enum__announcement_v_version_status";
  DROP TYPE "payload"."enum__announcement_v_published_locale";`)
}
