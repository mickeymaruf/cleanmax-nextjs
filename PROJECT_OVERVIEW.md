# Project Overview

## Goal

Convert an existing Shopify app/theme into a **headless WooCommerce storefront using Next.js**.

The frontend will communicate with WordPress/WooCommerce through APIs.

## Development Approach

* Convert the project **one section at a time**.
* Most section content should remain **static in Next.js**.
* For each section, specific instructions will define what must become dynamic.
* Do not make content dynamic unless explicitly required.
* Preserve the existing design and behavior unless instructed otherwise.

## WooCommerce Scope

WordPress/WooCommerce will primarily manage:

* Products
* Product-related data
* Cart-related functionality
* Other dynamic commerce data when explicitly required

## Customer Accounts

* No login system initially.
* No customer account functionality initially.
* Shopping will support **guest users**.
* Cart and session architecture will be designed separately when implementation reaches that stage.

## Development Rules

1. Work on one section at a time.
2. Do not modify unrelated sections.
3. Do not introduce unnecessary WordPress plugins or complexity.
4. Prefer simple, maintainable architecture.
5. Keep the Next.js frontend performant and SEO-friendly.
6. Follow the specific dynamic/static requirements provided for each section.

## Progress Tracking

Maintain a `PROGRESS.md` file.

After each meaningful work session:

* Add only **2–3 short lines** describing what was completed.
* Record architecture or technical decisions only when they are important for future work.
* Do not write explanations, summaries, or unnecessary history.
* Keep the file concise. If old information is no longer useful, remove or consolidate it.

The progress file should function as a quick state reference, not documentation.
