#!/usr/bin/env python3
"""Validate audit coverage. Exit 0: complete, 1: incomplete, 2: invalid input."""
import json
import sys

IDS = 'scope copy layout media links branding wrapper demo accessibility responsive forms commerce booking discovery menus galleries accounts services reliability performance metadata privacy review'.split()
STATUSES = {'Passed', 'Needs fixing', 'Not present', "Couldn't test"}

def evaluate(m):
    gaps = []
    for key in ('target', 'version', 'url', 'timestamp'):
        if not m.get(key): gaps.append('Missing '+key)
    required = m.get('required', [])
    if not required: gaps.append('No required route/state/browser/viewport matrix')
    if set(m.get('browsers', [])) != {'chromium', 'firefox', 'webkit'}:
        gaps.append('Three-browser scope missing')
    def identity(row):
        return tuple(row.get(k) for k in ('route', 'state', 'browser', 'viewport'))
    captures = m.get('captures', [])
    for row in required:
        key = identity(row)
        if not all(key): gaps.append('Invalid required matrix row'); continue
        matches = [c for c in captures if identity(c) == key]
        if not matches: gaps.append('Missing capture: '+str(key)); continue
        for c in matches:
            if not c.get('file') or not c.get('leadReviewed') or not c.get('reviewEvidence'):
                gaps.append('Unreviewed capture: '+str(key))
    for browser in m.get('browsers', []):
        if not any(r.get('browser') == browser for r in required):
            gaps.append('No matrix rows for '+browser)
    checklist = {r.get('id'):r for r in m.get('checklist', [])}
    for key in IDS:
        row = checklist.get(key)
        if not row or row.get('status') not in STATUSES or not row.get('evidence'):
            gaps.append('Missing checklist evidence: '+key)
        elif row['status'] == "Couldn't test" and not row.get('acceptedBoundary'):
            gaps.append('Unresolved check: '+key)
    if not m.get('inventoryReconciled'): gaps.append('Inventory not reconciled')
    reviewer = m.get('independentReview', {})
    if not reviewer.get('reviewer') or not reviewer.get('evidence') or not reviewer.get('coverage'):
        gaps.append('Independent review missing')
    unresolved = m.get('unresolvedRuntimeFailures', [])
    if unresolved: gaps.append('Unclassified runtime failures remain')
    findings = any(r.get('status') == 'Needs fixing' for r in checklist.values())
    boundaries = [r['id'] for r in checklist.values() if r.get('status') == "Couldn't test"]
    verdict = 'Audit incomplete' if gaps else ('Audit complete with findings' if findings else 'Site passes the scoped checks')
    return {'verdict':verdict, 'gaps':gaps, 'untestedBoundaries':boundaries}

if __name__ == '__main__':
    try:
        result = evaluate(json.load(open(sys.argv[1])))
    except (OSError, ValueError, IndexError, TypeError, AttributeError) as error:
        print(json.dumps({'error':str(error)})); sys.exit(2)
    print(json.dumps(result, indent=2))
    sys.exit(1 if result['gaps'] else 0)
