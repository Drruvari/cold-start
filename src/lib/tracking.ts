const baseUrl = import.meta.env.BASE_URL || window.location.origin

export function buildOpenTrackingUrl(leadId: string): string {
    return `${baseUrl}/api/track/open?leadId=${encodeURIComponent(leadId)}&t=${Date.now()}`
}

export function buildClickTrackingUrl(leadId: string, url: string): string {
    const encodedUrl = encodeURIComponent(url)
    return `${baseUrl}/api/track/click?leadId=${encodeURIComponent(leadId)}&url=${encodedUrl}`
}
