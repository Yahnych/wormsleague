# Migration `20200831050951`

This migration has been generated by Conner Petzold at 8/30/2020, 11:09:51 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."User" (
"id" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"username" text  NOT NULL ,
"email" text  NOT NULL ,
"password" text  NOT NULL ,
"countryCode" text   ,
"avatar" text   ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Game" (
"id" text  NOT NULL ,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"reportedAt" timestamp(3)  NOT NULL ,
"startedAt" timestamp(3)  NOT NULL ,
"duration" integer  NOT NULL ,
"leagueId" text   ,
"replayUrl" text  NOT NULL ,
"logUrl" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Player" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"userId" text  NOT NULL ,
"leagueId" text  NOT NULL ,
"gameId" text  NOT NULL ,
"won" boolean  NOT NULL ,
"teamName" text  NOT NULL ,
"teamColor" text  NOT NULL ,
"turnCount" integer  NOT NULL ,
"turnTime" integer  NOT NULL ,
"retreatTime" integer  NOT NULL ,
PRIMARY KEY ("userId","gameId"))

CREATE TABLE "public"."League" (
"id" text  NOT NULL ,
"name" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Rank" (
"userId" text  NOT NULL ,
"leagueId" text  NOT NULL ,
"rating" Decimal(65,30)  NOT NULL ,
"ratingDeviation" Decimal(65,30)  NOT NULL ,
"ratingVolatility" Decimal(65,30)  NOT NULL ,
"wins" integer  NOT NULL DEFAULT 0,
"losses" integer  NOT NULL DEFAULT 0,
PRIMARY KEY ("userId","leagueId"))

CREATE UNIQUE INDEX "User.username_unique" ON "public"."User"("username")

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")

ALTER TABLE "public"."Game" ADD FOREIGN KEY ("leagueId")REFERENCES "public"."League"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Player" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Player" ADD FOREIGN KEY ("userId", "leagueId")REFERENCES "public"."Rank"("userId","leagueId") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Player" ADD FOREIGN KEY ("gameId")REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Rank" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Rank" ADD FOREIGN KEY ("leagueId")REFERENCES "public"."League"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200831050951
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,76 @@
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator prisma_client {
+  provider = "prisma-client-js"
+}
+
+model User {
+  id          String   @default(uuid()) @id
+  createdAt   DateTime @default(now())
+  username    String   @unique
+  email       String   @unique
+  password    String
+  countryCode String?
+  avatar      String?
+
+  ranks       Rank[]
+  playedGames Player[]
+}
+
+model Game {
+  id         String   @default(uuid()) @id
+  createdAt  DateTime @default(now())
+  reportedAt DateTime
+  startedAt  DateTime
+  duration   Int
+  players    Player[]
+  league     League?  @relation(fields: [leagueId], references: [id])
+  leagueId   String?
+  replayUrl  String
+  logUrl     String
+}
+
+model Player {
+  createdAt   DateTime @default(now())
+  user        User     @relation(fields: [userId], references: [id])
+  userId      String
+  rank        Rank     @relation(fields: [userId, leagueId], references: [userId, leagueId])
+  leagueId    String
+  game        Game     @relation(fields: [gameId], references: [id])
+  gameId      String
+  won         Boolean
+  teamName    String
+  teamColor   String
+  turnCount   Int
+  turnTime    Int
+  retreatTime Int
+
+  @@id([userId, gameId])
+}
+
+model League {
+  id    String @default(uuid()) @id
+  name  String
+  ranks Rank[]
+  games Game[]
+}
+
+model Rank {
+  user     User   @relation(fields: [userId], references: [id])
+  userId   String
+  league   League @relation(fields: [leagueId], references: [id])
+  leagueId String
+
+  rating           Float
+  ratingDeviation  Float
+  ratingVolatility Float
+
+  wins        Int      @default(0)
+  losses      Int      @default(0)
+  playedGames Player[]
+
+  @@id([userId, leagueId])
+}
```


