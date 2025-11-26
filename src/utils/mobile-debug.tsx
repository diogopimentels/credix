import { useEffect, useState } from 'react';

interface OverflowElement {
    selector: string;
    width: number;
    element: HTMLElement;
}

/**
 * Mobile Debug Overlay
 * Enabled with ?debugMobileOverflow=true query parameter
 * 
 * Features:
 * - Shows current viewport width
 * - Detects elements wider than viewport
 * - Highlights overflowing elements with red outline
 * - Lists all overflow elements in overlay
 */
export function MobileDebugOverlay() {
    const [enabled, setEnabled] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(0);
    const [overflowElements, setOverflowElements] = useState<OverflowElement[]>([]);

    useEffect(() => {
        // Check for ?debugMobileOverflow=true in URL
        const params = new URLSearchParams(window.location.search);
        const debugEnabled = params.get('debugMobileOverflow') === 'true';
        setEnabled(debugEnabled);

        if (!debugEnabled) return;

        const checkOverflow = () => {
            const vw = document.documentElement.clientWidth;
            setViewportWidth(vw);

            const overflow: OverflowElement[] = [];

            // Check all elements
            document.querySelectorAll('*').forEach((el) => {
                const htmlEl = el as HTMLElement;
                const rect = htmlEl.getBoundingClientRect();

                if (rect.width > vw) {
                    // Generate selector
                    const selector = htmlEl.tagName.toLowerCase() +
                        (htmlEl.id ? `#${htmlEl.id}` : '') +
                        (htmlEl.className ? `.${htmlEl.className.split(' ').join('.')}` : '');

                    overflow.push({
                        selector,
                        width: Math.round(rect.width),
                        element: htmlEl,
                    });

                    // Highlight element
                    htmlEl.style.outline = '3px solid red';
                    htmlEl.style.outlineOffset = '-3px';
                }
            });

            setOverflowElements(overflow);
        };

        checkOverflow();

        // Re-check on resize
        window.addEventListener('resize', checkOverflow);

        // Re-check on mutation (for dynamic content)
        const observer = new MutationObserver(checkOverflow);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('resize', checkOverflow);
            observer.disconnect();

            // Remove highlights
            document.querySelectorAll('*').forEach((el) => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.outline = '';
                htmlEl.style.outlineOffset = '';
            });
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '12px',
                maxHeight: '50vh',
                overflowY: 'auto',
            }}
        >
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '14px' }}>
                📱 Mobile Debug Overlay
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
                <strong>Viewport Width:</strong> {viewportWidth}px
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
                <strong>Overflow Elements:</strong> {overflowElements.length}
            </div>

            {overflowElements.length > 0 && (
                <div>
                    <div style={{ marginTop: '0.5rem', marginBottom: '0.25rem', color: '#ff6b6b' }}>
                        ⚠️ Elements exceeding viewport:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', maxHeight: '30vh', overflowY: 'auto' }}>
                        {overflowElements.map((item, i) => (
                            <li key={i} style={{ marginBottom: '0.25rem' }}>
                                <code>{item.selector}</code>
                                <span style={{ color: '#ffd43b', marginLeft: '0.5rem' }}>
                                    ({item.width}px)
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {overflowElements.length === 0 && (
                <div style={{ color: '#51cf66', marginTop: '0.5rem' }}>
                    ✅ No overflow detected!
                </div>
            )}

            <div style={{ marginTop: '1rem', fontSize: '11px', opacity: 0.7 }}>
                To disable: remove ?debugMobileOverflow=true from URL
            </div>
        </div>
    );
}
