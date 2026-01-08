export interface PrerequisiteInfo {
    code: string;
    name: string;
    grade: string;
    met: boolean;
}

export type BatchCode = 'A' | 'B' | 'C';

export interface BatchRecommendation {
    batch: string;
    batchCode: BatchCode;
    canUpgrade: boolean;
}

/**
 * Determines the recommended batch based on prerequisite performance.
 * 
 * Rules:
 * - No prerequisites: Batch B (Standard)
 * - Any failure (not met): Batch C (Supported)
 * - All As: Batch A (Fast Track)
 * - All Passing (but not all As): Batch B (Standard)
 */
export function getRecommendedBatch(prereqs: PrerequisiteInfo[]): BatchRecommendation {
    if (prereqs.length === 0) {
        return { batch: 'Standard Track - Full Semester', batchCode: 'B', canUpgrade: true };
    }

    const allHaveGrades = prereqs.every(p => p.grade && p.grade !== 'N/A' && p.grade !== 'IP');

    // If we don't have grades for all prerequisites (e.g. planning phase without transcript),
    // we might assume standard pacing or prompt for more info. 
    // For now, if simply checking requirements:

    const metAll = prereqs.every(p => p.met);
    const hasFailure = prereqs.some(p => !p.met);

    // Strict "All As" check for Fast Track
    const allAs = prereqs.every(p =>
        p.met && (p.grade === 'A' || p.grade === 'A+' || p.grade === 'A-')
    );

    if (hasFailure) {
        return { batch: 'Supported Track - Full Semester + Tutoring', batchCode: 'C', canUpgrade: true };
    }

    if (allAs) {
        return { batch: 'Fast Track - 7 weeks', batchCode: 'A', canUpgrade: false };
    }

    if (metAll) {
        return { batch: 'Standard Track - Full Semester', batchCode: 'B', canUpgrade: true };
    }

    // Default fallback
    return { batch: 'Supported Track - Full Semester + Tutoring', batchCode: 'C', canUpgrade: true };
}
