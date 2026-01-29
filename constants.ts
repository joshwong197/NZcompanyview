export const LAYOUT_DIRECTION = 'TB'; // Top-Bottom layout (Phase 2 stable)
export const NODE_WIDTH = 240; // Increased from 180 to show full entity names
export const NODE_HEIGHT = 80;

export const BASE_API_URL = 'https://api.business.govt.nz';

export const API_PATHS = {
  nzbn: '/nzbn/v5',
  companies: '/companies-office/companies-register/entity-roles/v3', // Corrected Path segment
};

// React Flow node types
export const RF_NODE_TYPES = {
  company: 'companyNode',
  person: 'personNode',
  summary: 'summaryNode',
};