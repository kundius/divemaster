/*
  Warnings:

  - You are about to drop the column `long_title` on the `blog_post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `blog_post` RENAME COLUMN `long_title` TO `longTitle`;
