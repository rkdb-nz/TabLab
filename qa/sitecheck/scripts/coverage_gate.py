#!/usr/bin/env python3
"""Validate audit coverage. Exit 0: complete, 1: incomplete, 2: invalid input."""
import json
import sys
from pathlib import Path

IDS = 'scope copy layout media links branding wrapper demo accessibility responsive forms commerce booking discovery menus galleries accounts services reliability performance metadata privacy review'.split()
STATUSES = {'Passed', 'Needs fixing', 'Not present', "Couldn't test"}

def evaluate(m, base_directory=None):
    gaps = []
    for key in ('target', 'version', 'url', 'timestamp', 'leadReviewer'):
        if not m.get(key): gaps.append('Missing '+key)
    required = m.get('required', [])
    if not required: gaps.append('No required route/state/browser/viewport matrix')
    if set(m.get('browsers', [])) != {'chromium', 'firefox', 'webkit'}:
        gaps.append('Three-browser scope missing')
    def identity(row):
        return tuple(row.get(k) for k in ('route', 'state', 'browser', 'viewport'))
    inventory = m.get('inventory', [])
    if not inventory: gaps.append('No route/state inventory')
    viewports = ['1366x768','1440x900','1920x1080','320x568','568x320','360x780','780x360','390x844','844x390','412x915','915x412','780x300','768x1024','1024x768']
    matrix = {identity(r) for r in required}
    for route in inventory:
        if not route.get('route') or not route.get('states'): gaps.append('Invalid inventory row')
        for state in route.get('states', []):
            for browser in ('chromium','firefox','webkit'):
                for viewport in viewports:
                    if (route.get('route'),state,browser,viewport) not in matrix:
                        gaps.append('Missing matrix row: '+str((route.get('route'),state,browser,viewport)))
    captures = m.get('captures', [])
    for row in required:
        key = identity(row)
        if not all(key): gaps.append('Invalid required matrix row'); continue
        matches = [c for c in captures if identity(c) == key]
        if not matches: gaps.append('Missing capture: '+str(key)); continue
        for c in matches:
            if not c.get('file') or c.get('leadReviewed') is not True or not c.get('reviewEvidence'):
                gaps.append('Unreviewed capture: '+str(key))
            if base_directory is not None and not (base_directory / c.get('file', '')).is_file():
                gaps.append('Missing evidence file: '+str(c.get('file')))
    for browser in m.get('browsers', []):
        if not any(r.get('browser') == browser for r in required):
            gaps.append('No matrix rows for '+browser)
    checklist = {r.get('id'):r for r in m.get('checklist', [])}
    for key in IDS:
        row = checklist.get(key)
        if not row or row.get('status') not in STATUSES or not row.get('evidence'):
            gaps.append('Missing checklist evidence: '+key)
        elif row['status'] == 'Not present' and key in {'scope','copy','layout','links','branding','accessibility','responsive','reliability','performance','metadata','review'}:
            gaps.append('Always-required check marked absent: '+key)
        elif row['status'] == "Couldn't test" and not (row.get('acceptedBoundary') is True and row.get('boundaryReason') and row.get('coreChecksComplete') is True):
            gaps.append('Unresolved check: '+key)
    if m.get('inventoryReconciled') is not True: gaps.append('Inventory not reconciled')
    reviewer = m.get('independentReview', {})
    if not reviewer.get('reviewer') or not reviewer.get('evidence') or not reviewer.get('coverage'):
        gaps.append('Independent review missing')
    if reviewer.get('reviewer') == m.get('leadReviewer'): gaps.append('Independent reviewer equals lead')
    if not isinstance(reviewer.get('coverage'), list) or any(r.get('route') not in reviewer.get('coverage', []) for r in inventory):
        gaps.append('Independent review does not cover inventory routes')
    unresolved = m.get('unresolvedRuntimeFailures', [])
    if unresolved: gaps.append('Unclassified runtime failures remain')
    findings = any(r.get('status') == 'Needs fixing' for r in checklist.values())
    boundaries = [r['id'] for r in checklist.values() if r.get('status') == "Couldn't test"]
    verdict = 'Audit incomplete' if gaps else ('Audit complete with findings' if findings else 'Site passes the scoped checks')
    return {'verdict':verdict, 'gaps':gaps, 'untestedBoundaries':boundaries}

if __name__ == '__main__':
    try:
        manifest_path = Path(sys.argv[1]).resolve()
        result = evaluate(json.loads(manifest_path.read_text()), manifest_path.parent)
    except (OSError, ValueError, IndexError, TypeError, AttributeError) as error:
        print(json.dumps({'error':str(error)})); sys.exit(2)
    print(json.dumps(result, indent=2))
    sys.exit(1 if result['gaps'] else 0)
