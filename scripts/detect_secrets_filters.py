#!/usr/bin/env python3
"""
Custom filters for detect-secrets to ignore specific high-entropy patterns
that are known to be false positives.
"""

from detect_secrets.plugins.high_entropy_strings import HighEntropyStringsPlugin
import json
import re


def is_integrity_hash(string):
    """
    Checks if a string is likely an npm integrity hash.
    """
    if not string:
        return False
    
    # Typical integrity hash pattern: sha512-[base64 hash]
    integrity_pattern = r'^sha[0-9]+-[A-Za-z0-9+/=]+$'
    return bool(re.match(integrity_pattern, string))


def is_in_integrity_context(filename, line):
    """
    Checks if a line in a file is likely part of an npm integrity context.
    """
    if not (filename.endswith('package-lock.json') or filename.endswith('yarn.lock')):
        return False
    
    # Check if line contains "integrity": or "integrity" :
    integrity_line_pattern = r'"integrity"\s*:'
    return bool(re.search(integrity_line_pattern, line))


class ModifiedHighEntropyStringsPlugin(HighEntropyStringsPlugin):
    """
    Modified version of HighEntropyStringsPlugin that ignores npm integrity hashes.
    """
    
    def analyze_string(self, string, file_path, line_num, **kwargs):
        """
        Overridden analyze_string method to filter out npm integrity hashes.
        """
        # Get the line content if available
        line = kwargs.get('line', '')
        
        # Skip if this is an integrity hash or in an integrity context
        if is_integrity_hash(string) or is_in_integrity_context(file_path, line):
            return {}
        
        # Otherwise, use the parent class's analysis
        return super().analyze_string(string, file_path, line_num, **kwargs)


if __name__ == '__main__':
    # This can be used for testing the filter
    print("This is a custom filter for detect-secrets to ignore npm integrity hashes.")