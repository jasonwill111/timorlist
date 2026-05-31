---
name: 0096-carousel-banner-fix
description: Quick CSS fix for carousel navigation arrows
metadata:
  type: increment
  created: 2026-05-30
  mode: emergency
---

# Plan: Carousel Banner Fix

## Mode: Emergency (Quick Fix)

CSS bug fix for navigation arrow positioning.

## Root Cause

- `position: relative` instead of `position: absolute`
- `-translate-y-1/2` class overriding inline styles

## Implementation

Single file change: `src/components/ui/CarouselBanner.astro`

1. Move arrows inside `carousel-track-wrapper`
2. Apply inline `position: absolute; top: 50%; transform: translateY(-50%)`

## Verification

| Page | Status |
|------|--------|
| /businesses | ✅ |
| /listings | ✅ |
| / (homepage) | ✅ |
