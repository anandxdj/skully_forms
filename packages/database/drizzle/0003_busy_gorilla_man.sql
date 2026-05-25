CREATE TABLE "form_analytics_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"field_id" varchar(50) NOT NULL,
	"option" varchar(255) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "submission_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "form_analytics_cache" ADD CONSTRAINT "form_analytics_cache_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "form_analytics_cache_unique_idx" ON "form_analytics_cache" USING btree ("form_id","field_id","option");--> statement-breakpoint
CREATE INDEX "form_analytics_cache_form_idx" ON "form_analytics_cache" USING btree ("form_id");