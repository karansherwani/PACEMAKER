"""
NOTE: This is just a script that cleans up the course csv i.e takes the courses and finds it preRequistes
      We can go about adding more important data like class credits or
      semester availability but this is a starting point
      
"""
import csv
import re

def ReadFile(filename):
    """
    Reads a CSV file containing course data and builds a dictionary
    mapping each course to its list of prerequisite courses.

    Parameters:
        filename (str): Path to the CSV file

    Returns:
        dict: { "COURSE CODE": [list of prerequisite course codes] }
        NOTE: In case if theres not a course code i.e
              instructor consent etc the entire string is placed in the List(values of the Key)
    """

    # Open the CSV file
    file = open(filename)
    reader = csv.reader(file)

    # Dictionary to store course → prerequisites mapping
    coursePreReq = {}

    count = 0
    for row in reader:

        # Skip empty rows
        if not row:
            continue

        count += 1

        # Skip header row
        if count > 1:
            # Ensure row has expected columns
            if len(row) > 1:
                # Extract prerequisite text from column 15
                preReq = extract_prereqs(row[15])

                # Construct course code
                courseCode = row[1] + " " + row[2]

                # Add course and its prerequisites to dictionary
                if courseCode not in coursePreReq:
                    coursePreReq[courseCode] = preReq

    return coursePreReq


def extract_prereqs(prereq_text):
    """
    Extracts course codes from a prerequisite text string.
    Handles:
    - Single courses (CSC 210)
    - Courses with suffixes (MCB 181R)
    - Slashed courses (CMM 456/567)

    Parameters:
        prereq_text (str): Raw prerequisite text from CSV

    Returns:
        list: List of prerequisite course codes
              If no course codes are found, returns the original text in a list
    """

    # Regex pattern to match course codes and slashed variants
    pattern = re.compile(
        r'\b([A-Z]{2,4})\s*(\d{3}[A-Z]?)(?:/(\d{3}[A-Z]?))?\b'
    )

    matches = pattern.findall(prereq_text)
    courses = []

    for match in matches:
        prefix = match[0]

        # First course number
        courses.append(f"{prefix} {match[1]}")

        # Second course number (if slash exists)
        if match[2]:
            courses.append(f"{prefix} {match[2]}")

    # If no structured course codes were found,
    # return the original prerequisite text
    if not courses:
        return [prereq_text.strip()]

    return courses


def main():
    """
    Main driver function.
    Reads the course file and prints the course-prerequisite mapping.
    """

    output = ReadFile("courses-report.2026-01-15.csv")
    print(output)


main()
