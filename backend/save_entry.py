#!/usr/bin/env python3
"""
save_entry.py - Save reflections to JSON file
This script allows users to add reflection entries to reflections.json with timestamp
"""

import json
import os
from datetime import datetime

def load_reflections(filename="reflections.json"):
    """Load existing reflections from JSON file"""
    if os.path.exists(filename):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            print("Error: Invalid JSON in file. Starting fresh.")
            return []
    return []

def save_reflections(reflections, filename="reflections.json"):
    """Save reflections to JSON file"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(reflections, f, indent=2, ensure_ascii=False)
        print(f"✓ Successfully saved reflection to {filename}")
        return True
    except Exception as e:
        print(f"✗ Error saving file: {e}")
        return False

def add_reflection():
    """Add a new reflection entry"""
    print("\n" + "="*60)
    print("📝 Add New Reflection")
    print("="*60)
    
    # Get reflection text
    print("Enter your reflection (press Enter twice to finish):")
    lines = []
    while True:
        line = input()
        if line:
            lines.append(line)
        else:
            if lines:
                break
            else:
                print("Please enter some text.")
    
    reflection_text = "\n".join(lines)
    
    # Get optional category
    category = input("\nCategory (optional, e.g., 'Learning', 'Challenge', 'Insight'): ").strip()
    if not category:
        category = "General"
    
    # Create entry
    entry = {
        "date": datetime.now().isoformat(),
        "text": reflection_text,
        "category": category,
        "id": int(datetime.now().timestamp() * 1000)
    }
    
    # Load existing, add new, save
    reflections = load_reflections()
    reflections.append(entry)
    
    if save_reflections(reflections):
        print("\n" + "="*60)
        print(f"Reflection added successfully!")
        print(f"Total reflections: {len(reflections)}")
        print("="*60 + "\n")
        return True
    return False

def view_reflections():
    """Display all reflections"""
    reflections = load_reflections()
    
    if not reflections:
        print("\nNo reflections yet. Add one with the 'add' command.\n")
        return
    
    print("\n" + "="*60)
    print(f"📚 All Reflections ({len(reflections)} total)")
    print("="*60)
    
    for i, reflection in enumerate(reflections, 1):
        date_str = reflection.get('date', 'Unknown')
        category = reflection.get('category', 'General')
        text = reflection.get('text', 'No text')
        
        # Parse ISO format date
        try:
            date_obj = datetime.fromisoformat(date_str)
            formatted_date = date_obj.strftime("%Y-%m-%d %H:%M:%S")
        except:
            formatted_date = date_str
        
        print(f"\n[{i}] {formatted_date} | {category}")
        print("-" * 60)
        print(text[:200] + "..." if len(text) > 200 else text)
    
    print("\n" + "="*60 + "\n")

def main():
    """Main menu"""
    while True:
        print("\n" + "="*60)
        print("🌟 Reflection Manager")
        print("="*60)
        print("1. Add reflection")
        print("2. View all reflections")
        print("3. Exit")
        print("="*60)
        
        choice = input("Choose an option (1-3): ").strip()
        
        if choice == "1":
            add_reflection()
        elif choice == "2":
            view_reflections()
        elif choice == "3":
            print("Goodbye!\n")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
