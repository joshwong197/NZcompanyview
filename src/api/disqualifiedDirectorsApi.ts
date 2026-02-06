import { ApiConfig, LoggerCallback } from '../../types';
import { BASE_API_URL } from '../../constants';

const DISQUALIFIED_DIRECTORS_PATH = '/companies-office/companies-register/disqualified-directors/v3';

// Response Types based on docs/companies-disqualified-director-search.json
export interface DisqualifiedDirector {
    firstName: string;
    middleName?: string;
    lastName: string;
    disqualifiedDirectorId: string | number; // Docs say string in schema but example has number.
    aliases?: {
        aliases: string[];
    };
    disqualificationCriteria?: {
        criteria: Array<{
            startDate: string;
            endDate?: string;
            criteria?: string;
            comments?: string;
        }>;
    };
    associations?: {
        associations: Array<{
            associatedCompanyNumber?: string;
            associatedCompanyName?: string;
            associatedCompanyNzbn?: string;
            associatedCompanyStatusCode?: string;
        }>;
    };
}

export interface DisqualifiedDirectorSearchResult {
    totalResults: number;
    pageSize: number;
    currentPage: number;
    roles: DisqualifiedDirector[];
}

/**
 * Helper for safe fetching with logging
 */
async function safeFetch(url: string, headers: HeadersInit, logger?: LoggerCallback) {
    const method = 'GET';

    if (logger) {
        const maskedHeaders: Record<string, string> = {};
        if (typeof headers === 'object' && !Array.isArray(headers)) {
            Object.entries(headers as Record<string, string>).forEach(([k, v]) => {
                maskedHeaders[k] = v.length > 4 ? v.substring(0, 4) + '****' : '****';
            });
        }

        logger({
            timestamp: new Date().toISOString(),
            method,
            url,
            headers: maskedHeaders,
            status: 0,
            message: 'Sending Disqualified Director Request...'
        });
    }

    try {
        const res = await fetch(url, { headers });

        if (logger) {
            logger({
                timestamp: new Date().toISOString(),
                method,
                url,
                headers: {},
                status: res.status,
                message: res.statusText
            });
        }

        return res;
    } catch (error: any) {
        if (logger) {
            logger({
                timestamp: new Date().toISOString(),
                method,
                url,
                headers: {},
                status: 0,
                message: `Network Error: ${error.message}`
            });
        }
        throw error;
    }
}

/**
 * Searches for disqualified directors by name.
 * 
 * @param name Name of the person to search for (min 2 chars)
 * @param config ApiConfig containing the API key
 * @param logger Optional logger callback
 * @param pageSize Number of results per page (default 10)
 * @param page Page number (default 0)
 */
export async function searchDisqualifiedDirectors(
    name: string,
    config: ApiConfig,
    logger?: LoggerCallback,
    pageSize: number = 10,
    page: number = 0
): Promise<DisqualifiedDirectorSearchResult> {
    const envPath = config.environment === 'prod' ? 'gateway' : 'sandbox';
    // Note: The base URL in docs includes /companies-office/companies-register/disqualified-directors/v3
    // logic in apiService.ts constructs base url as `${BASE_API_URL}/${envPath}${API_PATHS.companies}`
    // We need to construct the correct path.
    // Docs: https://api.business.govt.nz/gateway/companies-office/companies-register/disqualified-directors/v3/search

    // existing constants.ts likely has BASE_API_URL = "https://api.business.govt.nz"
    // so we build it carefully.

    const baseUrl = `${BASE_API_URL}/${envPath}${DISQUALIFIED_DIRECTORS_PATH}`;
    const url = `${baseUrl}/search?name=${encodeURIComponent(name)}&page=${page}&page-size=${pageSize}`;

    // Check for the specific key in config (we will add disqualifiedDirectorsKey to ApiConfig type)
    // For now using cast or we update type first. I'll treat it as property access on extended type.
    const apiKey = (config as any).disqualifiedDirectorsKey;

    if (!apiKey) {
        throw new Error("Disqualified Directors API Key is missing.");
    }

    const response = await safeFetch(url, {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Accept': 'application/json'
    }, logger);

    if (!response.ok) {
        if (response.status === 401) throw new Error("Disqualified Directors API Unauthorized.");
        throw new Error(`Disqualified Directors API Error: ${response.status}`);
    }

    return await response.json();
}
