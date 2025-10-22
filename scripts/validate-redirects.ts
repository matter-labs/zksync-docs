/**
 * Script to validate Firebase redirect destinations exist in the content directory
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface FirebaseRedirect {
  source: string;
  destination: string;
  type: number;
  regex?: string;
}

interface ValidationResult {
  destination: string;
  exists: boolean;
  checkedPaths: string[];
  source: string;
}

function main() {
  console.log('Validating Firebase redirect destinations...\n');

  // Load Firebase config
  const firebaseConfigPath = join(process.cwd(), 'firebase.json');
  const firebaseConfig = JSON.parse(readFileSync(firebaseConfigPath, 'utf-8'));
  const redirects: FirebaseRedirect[] = firebaseConfig.hosting?.redirects || [];

  console.log(`Found ${redirects.length} redirects to validate\n`);

  const results: ValidationResult[] = [];
  const contentDir = join(process.cwd(), 'content');

  for (const redirect of redirects) {
    const { destination, source } = redirect;

    // Skip external URLs
    if (destination.startsWith('http://') || destination.startsWith('https://')) {
      continue;
    }

    // Skip destinations with placeholders (dynamic routes)
    if (destination.includes(':')) {
      continue;
    }

    // Skip wildcard destinations
    if (destination.includes('*')) {
      continue;
    }

    // Clean the destination path
    const cleanDest = destination.split('?')[0].split('#')[0];

    // Possible paths to check
    const pathsToCheck = [
      // Direct match
      join(contentDir, `${cleanDest}.md`),
      join(contentDir, `${cleanDest}.mdx`),
      // With numbered prefix (00., 10., 20., etc.)
      ...Array.from({ length: 10 }, (_, i) => i * 10).flatMap((num) => [
        join(
          contentDir,
          cleanDest
            .replace(/^\//, '')
            .split('/')
            .map((part, idx) => (idx === 0 ? `${num.toString().padStart(2, '0')}.${part}` : part))
            .join('/') + '.md'
        ),
        join(
          contentDir,
          cleanDest
            .replace(/^\//, '')
            .split('/')
            .map((part, idx) => (idx === 0 ? `${num.toString().padStart(2, '0')}.${part}` : part))
            .join('/') + '.mdx'
        ),
      ]),
      // Index file in directory
      join(contentDir, `${cleanDest}/index.md`),
      join(contentDir, `${cleanDest}/index.mdx`),
      // Numbered directory with index
      ...Array.from({ length: 10 }, (_, i) => i * 10).flatMap((num) => [
        join(
          contentDir,
          cleanDest
            .replace(/^\//, '')
            .split('/')
            .map((part, idx) => (idx === 0 ? `${num.toString().padStart(2, '0')}.${part}` : part))
            .join('/') + '/index.md'
        ),
        join(
          contentDir,
          cleanDest
            .replace(/^\//, '')
            .split('/')
            .map((part, idx) => (idx === 0 ? `${num.toString().padStart(2, '0')}.${part}` : part))
            .join('/') + '/index.mdx'
        ),
      ]),
    ];

    // Check if any path exists
    const exists = pathsToCheck.some((path) => existsSync(path));

    results.push({
      destination: cleanDest,
      exists,
      checkedPaths: pathsToCheck,
      source,
    });
  }

  // Filter to only missing destinations
  const missing = results.filter((r) => !r.exists);

  console.log(`\n📊 Validation Summary:`);
  console.log(`  Total internal redirects checked: ${results.length}`);
  console.log(`  Valid destinations: ${results.length - missing.length}`);
  console.log(`  Missing destinations: ${missing.length}\n`);

  if (missing.length > 0) {
    console.log(`❌ Missing Destinations (${missing.length}):\n`);

    // Group by first path segment for easier review
    const grouped = missing.reduce(
      (acc, item) => {
        const firstSegment = item.destination.split('/')[1] || 'root';
        if (!acc[firstSegment]) acc[firstSegment] = [];
        acc[firstSegment].push(item);
        return acc;
      },
      {} as Record<string, ValidationResult[]>
    );

    for (const [segment, items] of Object.entries(grouped)) {
      console.log(`\n## /${segment}/ (${items.length} missing)`);
      items.forEach((item) => {
        console.log(`  Source: ${item.source}`);
        console.log(`  Destination: ${item.destination}`);
        console.log(`  ---`);
      });
    }

    // Write results to file
    const outputPath = join(process.cwd(), 'redirect-validation-results.json');
    const output = {
      summary: {
        total: results.length,
        valid: results.length - missing.length,
        missing: missing.length,
        timestamp: new Date().toISOString(),
      },
      missingDestinations: missing.map((m) => ({
        source: m.source,
        destination: m.destination,
      })),
    };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n📝 Full results written to: redirect-validation-results.json`);
  } else {
    console.log('✅ All redirect destinations are valid!');
  }
}

main();
