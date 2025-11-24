export async function fetchJson(input: RequestInfo, init?: RequestInit) {
    const res = await fetch(input, init);
    const contentType = res.headers.get('content-type') || '';

    // If server returned an error HTML page, surface a clear error
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const looksLikeHtml = text.trim().startsWith('<');
        throw new Error(`Request failed ${res.status} ${res.statusText}${looksLikeHtml ? ' (HTML response)' : ''}: ${looksLikeHtml ? '<HTML response omitted>' : text}`);
    }

    // If not JSON, try to detect HTML and throw
    if (!contentType.includes('application/json')) {
        const text = await res.text().catch(() => '');
        const looksLikeHtml = text.trim().startsWith('<');
        if (looksLikeHtml) {
            throw new Error(`Expected JSON but received HTML response from ${typeof input === 'string' ? input : '<request>'}`);
        }
        // Try parse as JSON anyway
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('Invalid JSON response');
        }
    }

    return res.json();
}
