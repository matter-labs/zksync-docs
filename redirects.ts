/**
 * REDIRECTS HAVE BEEN MIGRATED TO firebase.json
 *
 * This file is no longer used for managing redirects. All redirects have been
 * consolidated into firebase.json to provide a single source of truth.
 *
 * Why the change?
 * - Single source of truth: All redirects in one place
 * - Consistency: Firebase hosting will handle redirects directly
 * - Easier maintenance: No need to sync between two files
 * - Better testing: Comprehensive test suite validates all redirects
 *
 * How to add new redirects:
 * 1. Add your redirect to the 'redirects' array in firebase.json
 * 2. Use the format: { "source": "/old-path", "destination": "/new-path", "type": 301 }
 * 3. Run tests: bun run test:run
 * 4. Commit your changes
 *
 * For more information:
 * - Firebase redirect docs: https://firebase.google.com/docs/hosting/full-config#redirects
 * - Test suite: tests/redirects.test.ts
 * - Conversion script: scripts/convert-redirects.ts (for reference)
 * - Backup of old redirects: redirects.ts.backup
 *
 * Last migrated: October 21, 2025
 */

// Empty export to maintain module compatibility
export default {};
