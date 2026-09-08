import { boolean, integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull().unique(), emailVerified: boolean('emailVerified').notNull().default(false), image: text('image'), role: text('role').notNull().default('user'), banned: boolean('banned').notNull().default(false), banReason: text('banReason'), banExpires: timestamp('banExpires'), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
export const session = pgTable('session', { id: text('id').primaryKey(), expiresAt: timestamp('expiresAt').notNull(), token: text('token').notNull().unique(), createdAt: timestamp('createdAt').notNull(), updatedAt: timestamp('updatedAt').notNull(), ipAddress: text('ipAddress'), userAgent: text('userAgent'), userId: text('userId').notNull(), impersonatedBy: text('impersonatedBy') })
export const account = pgTable('account', { id: text('id').primaryKey(), accountId: text('accountId').notNull(), providerId: text('providerId').notNull(), userId: text('userId').notNull(), accessToken: text('accessToken'), refreshToken: text('refreshToken'), idToken: text('idToken'), accessTokenExpiresAt: timestamp('accessTokenExpiresAt'), refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'), scope: text('scope'), password: text('password'), createdAt: timestamp('createdAt').notNull(), updatedAt: timestamp('updatedAt').notNull() })
export const verification = pgTable('verification', { id: text('id').primaryKey(), identifier: text('identifier').notNull(), value: text('value').notNull(), expiresAt: timestamp('expiresAt').notNull(), createdAt: timestamp('createdAt'), updatedAt: timestamp('updatedAt') })
export const offers = pgTable('offers', { id: text('id').primaryKey(), slug: text('slug').notNull().unique(), title: text('title').notNull(), destination: text('destination').notNull(), category: text('category').notNull(), description: text('description').notNull(), price: numeric('price', { precision: 12, scale: 2 }), currency: text('currency').notNull().default('USD'), dateLabel: text('dateLabel'), includes: text('includes').array().notNull().default([]), imageUrl: text('imageUrl').notNull(), instagramUrl: text('instagramUrl'), instagramMediaId: text('instagramMediaId').unique(), status: text('status').notNull().default('draft'), featured: boolean('featured').notNull().default(false), source: text('source').notNull().default('manual'), manualOverrides: text('manualOverrides').array().notNull().default([]), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow() })
export type Offer = typeof offers.$inferSelect
export type NewOffer = typeof offers.$inferInsert

export const instagramPosts = pgTable('instagram_posts', {
  id: text('id').primaryKey(),
  mediaType: text('media_type').notNull(),
  mediaUrl: text('media_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  permalink: text('permalink').notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
  caption: text('caption'),
  likesCount: integer('likes_count'),
  location: text('location'),
  sortOrder: integer('sort_order').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
