import { Task } from "./types";

export const MANAGEMENT_TASKS: Task[] = [
    {
        id: 'mgmt-1',
        title: 'Annual Budget Review',
        description: 'Financial year ends in 2 days. Need to finalize and submit annual budget report to board of directors.',
        quadrant: 'not-important-urgent', // Intentionally miscategorized
        createdAt: '2025-03-27T08:00:00Z'
    },
    {
        id: 'mgmt-2',
        title: 'Employee Performance Reviews',
        description: 'Schedule and conduct quarterly performance reviews for team of 12 members. Due next month.',
        quadrant: 'important-urgent', // Intentionally miscategorized
        createdAt: '2025-03-27T09:15:00Z'
    },
    {
        id: 'mgmt-3',
        title: 'Office Coffee Machine Repair',
        description: 'Schedule maintenance for broken coffee machine in break room.',
        quadrant: 'important-urgent', // Intentionally miscategorized
        createdAt: '2025-03-27T10:30:00Z'
    },
    {
        id: 'mgmt-4',
        title: 'Leadership Development Program',
        description: 'Design 6-month leadership training program for high-potential employees.',
        quadrant: 'not-important-not-urgent', // Intentionally miscategorized
        createdAt: '2025-03-27T11:45:00Z'
    },
    {
        id: 'mgmt-5',
        title: 'Client Contract Negotiation',
        description: 'Major client contract expires next week. Prepare negotiation strategy and updated terms.',
        quadrant: 'not-important-not-urgent', // Intentionally miscategorized
        createdAt: '2025-03-27T13:00:00Z'
    },
    {
        id: 'mgmt-6',
        title: 'Office Supply Inventory',
        description: 'Count and reorder office supplies for next quarter.',
        quadrant: 'important-not-urgent', // Intentionally miscategorized
        createdAt: '2025-03-27T14:15:00Z'
    },
    {
        id: 'mgmt-7',
        title: 'Crisis Communication Plan',
        description: 'Develop emergency response plan for potential PR crisis scenarios.',
        quadrant: 'not-important-urgent', // Intentionally miscategorized
        createdAt: '2025-03-27T15:30:00Z'
    },
    {
        id: 'mgmt-8',
        title: 'Team Building Event',
        description: 'Plan monthly team building activity to improve workplace morale.',
        quadrant: 'important-urgent', // Intentionally miscategorized
        createdAt: '2025-03-27T16:45:00Z'
    },
    {
        id: 'mgmt-9',
        title: 'Market Analysis Report',
        description: 'Research and analyze emerging market trends for strategic planning meeting.',
        quadrant: 'not-important-not-urgent', // Intentionally miscategorized
        createdAt: '2025-03-27T17:00:00Z'
    },
    {
        id: 'mgmt-10',
        title: 'Reply to Social Media Comments',
        description: 'Respond to customer feedback on company social media channels.',
        quadrant: 'important-not-urgent', // Intentionally miscategorized
        createdAt: '2025-03-27T18:15:00Z'
    }
];