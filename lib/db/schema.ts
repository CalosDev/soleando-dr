import { boolean, index, integer, jsonb, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').default('user'),
  banned: boolean('banned').default(false),
  banReason: text('banReason'),
  banExpires: timestamp('banExpires'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull(),
  impersonatedBy: text('impersonatedBy'),
})
export const account = pgTable('account', { id: text('id').primaryKey(), accountId: text('accountId').notNull(), providerId: text('providerId').notNull(), userId: text('userId').notNull(), accessToken: text('accessToken'), refreshToken: text('refreshToken'), idToken: text('idToken'), accessTokenExpiresAt: timestamp('accessTokenExpiresAt'), refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'), scope: text('scope'), password: text('password'), createdAt: timestamp('createdAt').notNull(), updatedAt: timestamp('updatedAt').notNull() })
export const verification = pgTable('verification', { id: text('id').primaryKey(), identifier: text('identifier').notNull(), value: text('value').notNull(), expiresAt: timestamp('expiresAt').notNull(), createdAt: timestamp('createdAt'), updatedAt: timestamp('updatedAt') })
export const offers = pgTable('offers', { id: text('id').primaryKey(), slug: text('slug').notNull().unique(), title: text('title').notNull(), destination: text('destination').notNull(), category: text('category').notNull(), description: text('description').notNull(), price: numeric('price', { precision: 12, scale: 2 }), currency: text('currency').notNull().default('USD'), dateLabel: text('dateLabel'), includes: text('includes').array().notNull().default([]), imageUrl: text('imageUrl').notNull(), status: text('status').notNull().default('draft'), featured: boolean('featured').notNull().default(false), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow() })
export type Offer = typeof offers.$inferSelect
export type NewOffer = typeof offers.$inferInsert

export const catalogItems = pgTable('catalog_items', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(),
  slug: text('slug').notNull(),
  content: jsonb('content').notNull(),
  status: text('status').notNull().default('published'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
export type CatalogItem = typeof catalogItems.$inferSelect

export const profiles = pgTable('profiles', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  countryCode: text('country_code'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert

export const travelers = pgTable('travelers', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: text('date_of_birth'), // Format YYYY-MM-DD
  nationalityCode: text('nationality_code'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('travelers_user_id_idx').on(table.userId),
])
export type Traveler = typeof travelers.$inferSelect
export type NewTraveler = typeof travelers.$inferInsert

